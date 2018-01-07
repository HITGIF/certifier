function valueChanged() {
  if ($(".customCB").is(":checked")) {
    $(".enter_custom").hide();
    $(".upload_form").show();
  }
  else {
    $(".enter_custom").show();
    $(".upload_form").hide();
  }
}

function errorHandler(evt) {
  if (evt.target.error.name === "NotReadableError") {
    alert("Canno't read file !");
  }
}

function processData(csv) {
  var studentData = csv.split(/\r?\n|\r/);
  var tableData = '<table class="table table-bordered table-striped">';
  for (var count = 0; count < studentData.length; count++) {
    var cellData = studentData[count].split(",");
    tableData += '<tr>';
    for (var cellCount = 0; cellCount < cellData.length; cellCount++) {
      if (count === 0) {
        tableData += '<th>' + cellData[cellCount] + '</th>';
      }
      else {
        tableData += '<td>' + cellData[cellCount] + '</td>';
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

function handleFiles(files) {
  // Check for the various File API support.
  if (window.FileReader) {
    // FileReader are supported.
    getAsText(files[0]);
  }
  else {
    alert("FileReader are not supported in this browser.");
  }
}

angular.module('patternfly.navigation').controller('vertNavController', ['$scope',
  function ($scope) {
    $scope.navigationItems = [
      {
        title: "Home",
        iconClass: "fa fa-dashboard",
        href: "#/home"
      },
      {
        title: "Dolor",
        iconClass: "fa fa-shield",
        href: "#/dolor"
      },
      {
        title: "Ipsum",
        iconClass: "fa fa-space-shuttle",
        children: [
          {
            title: "Copiosae",
            href: "#/ipsum/Copiosae"
          },
          {
            title: "Patrioque",
            href: "#/ipsum/Patrioque"

          },
          {
            title: "Accumsan",
            href: "#/ipsum/Accumsan"
          }
        ]
      },
      {
        title: "Adipscing",
        iconClass: "fa fa-graduation-cap",
        href: "#/adipscing"
      }
    ];
    $scope.hideVerticalNav = function () {
      angular.element(document.querySelector("#verticalNavLayout")).addClass("hidden");
    };
  }
]);
