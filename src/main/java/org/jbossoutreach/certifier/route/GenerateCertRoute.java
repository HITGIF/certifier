package org.jbossoutreach.certifier.route;

import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import org.infinispan.Cache;
import org.infinispan.configuration.cache.ConfigurationBuilder;
import org.infinispan.manager.DefaultCacheManager;

import org.jbossoutreach.certifier.Constants;
import org.jbossoutreach.certifier.model.Certificate;
import org.jbossoutreach.certifier.model.Student;
import org.jbossoutreach.certifier.service.CertManager;

public class GenerateCertRoute implements Route {
    private final CertManager certManager;
    private DefaultCacheManager cacheManager;
    private Cache<String, String> cache;

    public GenerateCertRoute(CertManager certManager) {
        this.certManager = certManager;

        cacheManager = new DefaultCacheManager();
        cacheManager.defineConfiguration("certificateCache", new ConfigurationBuilder().build());
        cache = cacheManager.getCache("certificateCache");
    }

    @Override
    public void setup(Router router) {
        router.route().handler(BodyHandler.create());
        router.post("/generateCert").handler(this::generateCert);
        router.get("/fetchCert/*").handler(this::fetchCert);
    }

    private void generateCert(RoutingContext routingContext) {
        final Student student = new Student(
                routingContext.request().getFormAttribute("name"),
                routingContext.request().getFormAttribute("email"),
                routingContext.request().getFormAttribute("score")
        );

        final Certificate certificate = new Certificate(
                "Some Random Organisation",
                "Certificate of Participation",
                "Basic Git Bootcamp",
                student
        );

        final String outPath = certManager.generateCert(certificate);
        if (outPath == null) {
            routingContext.response()
                    .setStatusCode(500)
                    .end("Failed to generate the certificate.");
        } else {

            //Save the generated project in infinispan cache and return the url to fetch it.
            //Example URL: http://localhost:4000/fetchCert/johndoe@example.com.pdf
            final String fileURL = Constants.CERTIFICATE_PATH + student.getEmail() + ".pdf";
            this.cache.put(fileURL, outPath);

            routingContext.response()
                    .setStatusCode(201)
                    .end(Constants.SERVER_URL + fileURL);
        }
    }

    private void fetchCert(RoutingContext routingContext) {
        String certFile = cache.get(routingContext.request().path());
        if (certFile == null) {
            routingContext.response()
                    .setStatusCode(500)
                    .end("Failed to fetch the certificate.");
        } else {
            routingContext.response()
                    .setStatusCode(201)
                    .sendFile(certFile);
        }
    }
}
