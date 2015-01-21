var token = function(optionalArg) {
    var l = 10;
    if (typeof optionalArg != "undefined")
        l = optionalArg;
    var str = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    return str.substr(0, l);
};

function highlight(str, term) {
    var highlight_regex = new RegExp('(' + term + ')', 'gi');
    return str.replace(highlight_regex,
        '<span class="emph">$1</span>');
};
var client = new ZeroClipboard(document.getElementById("copy_bib"));
client.on("ready", function(readyEvent) {
    // alert( "ZeroClipboard SWF is ready!" );

    client.on("aftercopy", function(event) {
        // `this` === `client`
        // `event.target` === the element that was clicked
        //alert("Copied text to clipboard: " + event.data["text/plain"] );
    });
});

angular.module('dropzone', []).directive('dropzone', function() {
    return function(scope, element, attrs) {
        var config, dropzone;

        config = scope[attrs.dropzone];
        config.options.clickable = false;
        config.clickable = false;

        // create a Dropzone for the element with the given options
        dropzone = new Dropzone(element[0], config.options);

        // bind the given event handlers
        angular.forEach(config.eventHandlers, function(handler, event) {
            dropzone.on(event, handler);
        });
    };
});

var app = angular.module('papershelfApp', ['papershelfApp.directives', 'ngSanitize', 'MassAutoComplete', 'dropzone'])
    .controller('PapersCtrl', ['$scope', '$http',
        function($scope, $http, $sce, $q) {
            $scope.uploadUrl = "data/upload.php";
            // *************************** PAPERS ****************************** //
            var currentIndex = -1;
            $scope.details = [];
            $scope.papers = [];
            $scope.rawtex = "";
            $http.get('data/papers.json').
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
                console.log('click addPaper');
                var p = {
                    "rating": 0,
                    "tex": BibtexParser("@article{" + token() + ", \n author =     \"AUTHOR\",\n    title =      \"TITLE\"   }"),
                    "id": token(4)
                }
                $scope.papers.push(p);
            };
            $scope.loadDetails = function(id) {
                currentIndex = $scope.papers.map(function(d) {
                    return d.id;
                }).indexOf(id);
                $scope.details = $scope.papers[currentIndex];
                $scope.rawtex = getRawTex($scope.details.tex);
                $scope.dragtext = "drag your pdf here";
                document.getElementById("upload-pgr").style.width = '0%';
            };


            $scope.$watch('rawtex', function(newValue, oldValue) {
                $scope.details.tex = BibtexParser(newValue);
            });
            $scope.$watch('details', function(newValue, oldValue) {
                $scope.rawtex = getRawTex($scope.details.tex);

            }, true);

            // *************************** FUZZY SEARCH ************************ //
            $scope.query = {};

            function suggest_state(term) {
                var workaround = [];
                angular.forEach($scope.papers, function(v) {
                    workaround.push(v.tex.entries[0].Fields.title);
                });
                var fuzzySearch = new Fuse(workaround, {
                    shouldSort: true,
                    includeScore: true,
                    caseSensitive: false,
                    threshold: 0.6
                });
                if (!term)
                    return [];
                var results = [];

                fuzzySearch
                    .search(term)
                    .slice(0, 10)
                    .map(function(i) {
                        var val = workaround[i.item];
                        results.push({
                            label: highlight(val, term),
                            value: val
                        });
                    });
                console.log(results);
                return results;
            }
            $scope.autocomplete_options = {
                suggest: suggest_state
            };
            // *************************** DROPZONE **************************** //
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





angular.module("papershelfApp.directives", []).directive("rating", function() {
    // Write code here
    var directive = {};
    directive.restrict = 'AE';

    directive.scope = {
        score: '=score',
        max: '=max'
    };
    directive.template = '{{score}}';

    return directive;

});




app.directive('autoGrow', function() {
    return function(scope, element, attr) {
        var minHeight = element[0].offsetHeight,
            paddingLeft = element.css('paddingLeft'),
            paddingRight = element.css('paddingRight');

        var $shadow = angular.element('<div></div>').css({
            position: 'absolute',
            top: -10000,
            left: -10000,
            width: element[0].offsetWidth - parseInt(paddingLeft || 0) - parseInt(paddingRight || 0),
            fontSize: element.css('fontSize'),
            fontFamily: element.css('fontFamily'),
            lineHeight: element.css('lineHeight'),
            resize: 'none'
        });
        angular.element(document.body).append($shadow);

        var update = function() {
            var times = function(string, number) {
                for (var i = 0, r = ''; i < number; i++) {
                    r += string;
                }
                return r;
            }

            var val = element.val().replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
                .replace(/\n$/, '<br/>&nbsp;')
                .replace(/\n/g, '<br/>')
                .replace(/\s{2,}/g, function(space) {
                    return times('&nbsp;', space.length - 1) + ' '
                });
            $shadow.html(val);

            element.css('height', Math.max($shadow[0].offsetHeight + 10 /* the "threshold" */ , minHeight) + 'px');
        }

        element.bind('keyup keydown keypress change', update);
        update();
    }
});
