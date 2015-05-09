function highlight(str, term) {
    var highlight_regex = new RegExp('(' + term + ')', 'gi');
    return str.replace(highlight_regex,
        '<span class="emph">$1</span>');
};
var token = function(optionalArg) {
    var l = 20;
    if (typeof optionalArg != "undefined")
        l = optionalArg;
    var str = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    return str.substr(0, l);
};

var client = new ZeroClipboard(document.getElementById("copy_bib"));
client.on("ready", function(readyEvent) {
    client.on("aftercopy", function(event) {});
});

//$scope.uploadstep = '50%';
angular.module('dropzone', []).directive('dropzone', function() {


    return function(scope, element, attrs) {
        var config, dropzone;

        config = scope[attrs.dropzone];
        config.options.clickable = true;
        config.options.maxFilesize = 80;

        config.clickable = true;
        config.options.url = "data/upload.php";

        // create a Dropzone for the element with the given options
        dropzone = new Dropzone(element[0], config.options);
        dropzone.on('sending', function(file, xhr, formData) {
            formData.append('id', scope.details.id);
            document.getElementById("upload-pgr").style.backgroundColor = "red";
        });
        dropzone.on('uploadprogress', function(file, progress) {
            scope.uploadstep = progress + '%';
            document.getElementById("upload-pgr").style.width = progress + '%';
            if (progress == 100) {
                document.getElementById("upload-pgr").style.backgroundColor = "#46B525";
            }
        });

        // bind the given event handlers
        angular.forEach(config.eventHandlers, function(handler, event) {
            dropzone.on(event, handler);
        });
    };

});

var app = angular.module('papershelfApp', ['ngSanitize', 'angular.filter', 'dropzone'])
    .controller('PapersCtrl', ['$scope', '$http',
        function($scope, $http, $sce, $q) {
            $scope.uploadUrl = "data/upload.php";
            // *************************** PAPERS ****************************** //
            var currentIndex = -1;
            $scope.details = [];
            $scope.papers = [];
            $scope.rawtex = "";
            $http.get('data/papers.php').
            then(function(papersResponse) {
                //$scope.papers = papersResponse.data;
                angular.forEach(papersResponse.data, function(k, v) {
                    el = {
                        rating: k.rating,
                        "tex": BibtexParser(k.tex),
                        "pdf": k.pdf,
                        "jpg": k.jpg
                    };
                    if (typeof k.id != 'undefined') {
                        el.id = k.id;
                    } else {
                        el.id = token();
                    }
                    $scope.papers.push(el);
                });
            });
            $scope.persistPaper = function() {

                var req = {
                    "rating": $scope.details.rating,
                    "tex": getRawTex($scope.details.tex),
                    "id": $scope.details.id
                }

                $http.post('data/index.php', req).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            };
            $scope.addPaper = function() {
            	var i = token(15);
                console.log('click addPaper');
                var p = {
                    "rating": 0,
                    "tex": BibtexParser("@article{" + token() + ", \n author =     \"AUTHOR\",\n    title =      \"TITLE\"   }"),
                    "id": i
                }
                $scope.papers.push(p);
                $scope.loadDetails(i);
            };
            $scope.loadDetails = function(id) {
                currentIndex = $scope.papers.map(function(d) {
                    return d.id;
                }).indexOf(id);
                $scope.details = $scope.papers[currentIndex];
                //$scope.rawtex = getRawTex($scope.details.tex);
                //$scope.dragtext = "drag your pdf here";
                //console.log($scope.details.tex.entries[0]);
                //$scope.details.title = $scope.details.tex.entries[0].Fields.title;

            };

            /*$scope.$watch('details.title', function() {
                var hh = $('#title_detail')[0];
                while ($(hh).outerHeight() < hh.scrollHeight + parseFloat($(hh).css("borderTopWidth")) + parseFloat($(hh).css("borderBottomWidth"))) {
                    $(hh).height($(hh).height() + 1);
                };
            });*/



            $scope.$watch('rawtex', function(newValue, oldValue) {
                $scope.details.tex = BibtexParser(newValue);
            });
            $scope.$watch('details', function(newValue, oldValue) {
                $scope.rawtex = getRawTex($scope.details.tex);

            }, true);

            $scope.dropzoneConfig = {
                'options': { // passed into the Dropzone constructor
                    'url': 'data/upload.php'
                },
                'eventHandlers': {
                    'sending': function(file, xhr, formData) {},
                    'success': function(file, response) {}
                }
            };

        }
    ]);
app.filter('emph', function() {
    return function(input, e) {
        // do some bounds checking here to ensure it has that index
        return highlight(input, e); //$scope.query.value
    }
});

app.filter('addtoken', function() {
    return function(val) {
        if (!val) return 'data/dummy.jpg';
        return val + "?d=" + token();
    };
});
app.filter('uploadhint', function() {
    return function(val) {
        if (!val) return 'drag your pdf here';
        return 'thumbnail is in progress';
    };
});

