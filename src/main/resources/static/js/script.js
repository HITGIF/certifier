function valueChanged(){
        if($(".customCB").is(":checked")){
        $(".enter_custom").hide();
         $(".upload_form").show();      
    }
    else{
        $(".enter_custom").show();
        $(".upload_form").hide();
    }     
}

function errorHandler(evt) {
    if(evt.target.error.name === "NotReadableError") {
      alert("Canno't read file !");
    }
  }

function processData(csv) {
    var studentData = csv.split(/\r?\n|\r/);
    var tableData = '<table class="table table-bordered table-striped">';
    for(var count = 0; count<studentData.length; count++){
        var cellData = studentData[count].split(",");
        tableData += '<tr>';
        for(var cellCount=0; cellCount<cellData.length; cellCount++){
            if(count === 0){
                tableData += '<th>'+cellData[cellCount]+'</th>';
            }
            else{
                tableData += '<td>'+cellData[cellCount]+'</td>';
            }
        }
     tableData += '</tr>';
    }
    tableData += '</table>';
    $('#displayResults').html(tableData);
}

function loadHandler(event) {
      var csv = event.target.result;
      processData(csv);
    }

function getAsText(fileToRead) {
      var reader = new FileReader();
      // Read file into memory   
      reader.readAsText(fileToRead);
      // Handle errors load
      reader.onload = loadHandler;
      reader.onerror = errorHandler;
    }

function handleFiles(files){
      // Check for the various File API support.
      if (window.FileReader){
          // FileReader are supported.
          getAsText(files[0]);
      } 
      else{
          alert("FileReader are not supported in this browser.");
      }
    }

angular.module('patternfly.navigation').controller('vertNavController', ['$scope', '$http',
  function ($scope, $http) {
    $scope.formData = {};
    $scope.processForm = function () {
      $http({
        method: 'POST',
        url: '/certificates',
        data: $.param($scope.formData),  // pass in data as strings
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
      })
        .success(function (data) {
          console.log('Certificate generated, ID:' + data);
          window.open('/certificates/' + data);
        });
    };
    
    $scope.navigations = [
            {
              title: "View Certificates",
              iconClass: "fa fa-certificate",
              uiSref: "ViewNotes",
              uiSrefOptions: { someKey: 'SomeValue' }              
            },
            {
              title: "Your Certificates",
              iconClass : "fa fa-trophy",
              uiSref: "ipsum",
              children: [
              {
                title: "Google Code-In "

              },
              {
                title: "Google Summer Of Code"
              }
              ]
            },
            {
              title: "Share Certificates",
              iconClass : "fa fa-share-alt  ",
              uiSref: "dolor",
              children: [
              {
                title: "Facebook"

              },
              {
                title: "Twitter"
              }
              ]
            },
            {
              title: "Contact Us",
              iconClass : "fa fa-phone"
            }
          ];

  }
]);




