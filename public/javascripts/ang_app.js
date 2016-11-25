angular
    .module("notesApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list",
                controller: "ListController"
            })
            .when("/users/:userId/notes/new", {
                controller: "NewNoteController",
                templateUrl: "note-form"
            })
            .when("/users/:userId/notes/:title", {
                controller: "EditNoteController",
                templateUrl: "note"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Notes", function($http) {
        this.getNotes = function() {
            return $http.get("/api/notes").
            then(function(response) {
                //console.log("response data:" + JSON.stringify(response.data));
                return response;
            }, function(response) {
                alert("Error finding notes.");
            });
        };
        this.createNote = function(userId, note) {
            var url = "/api/users/"+ userId +"/notes/";
            return $http.post(url, note).
            then(function(response) {
                return response;
            }, function(response) {
                alert("Error creating note.");
            });
        };
        this.getNote = function(userId, title) {
            var url = "/api/users/"+ userId +"/notes/" + title;
            //console.log(url);
            return $http.get(url).
            then(function(response) {
                //console.log("response data:" + JSON.stringify(response.data));
                return response;
            }, function(response) {
                alert("Error finding this note.");
            });
        };
        this.editNote = function(userId, title, note) {
            var url = "/api/users/"+ userId +"/notes/" + title;
            //console.log(url);
            return $http.put(url, note).
            then(function(response) {
                return response;
            }, function(response) {
                alert("Error editing this note.");
                //console.log(response);
            });
        };
        this.deleteNote = function(userId, title) {
            var url = "/api/users/"+ userId +"/notes/" + title;
            //console.log("userId:" + userId + ", title:" + title);
            return $http.delete(url).
            then(function(response) {
                return response;
            }, function(response) {
                alert("Error deleting this note.");
                //console.log(response);
            });
        }
    })
    .controller("ListController", function($scope, Notes) {
        Notes.getNotes().then(function(notes){
            $scope.notes = notes.data;
        })
    })
    .controller("NewNoteController", function($scope, $routeParams, $location, Notes) {
        var userId;

        $scope.back = function() {
            $location.path("#/");
        };

        $scope.saveNote = function(note) {
            userId = $routeParams.userId;
            Notes.createNote(userId, note).then(function(doc) {
                var noteUrl = "/users/" + userId + "/note/" + note.title;
                $location.path(noteUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditNoteController", function($scope, $routeParams, Notes) {
        var userId;
        var title;

        Notes.getNote($routeParams.userId, $routeParams.title).then(function(response) {
            userId = $routeParams.userId;
            title = $routeParams.title;
            //console.log("userId:" + userId + ", title:" + title);
            $scope.note = response.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.noteFormUrl = "note-form";
        };

        $scope.back = function() {
            $scope.editMode = false;
            $scope.noteFormUrl = "";
        };

        $scope.saveNote = function(note) {
            Notes.editNote(userId, title, note);
            $scope.editMode = false;
            $scope.noteFormUrl = "";
        };

        $scope.deleteNote = function() {
            userId = $routeParams.userId;
            title = $routeParams.title;
            //console.log("userId:" + userId + ", title:" + title);
            Notes.deleteNote(userId, title);
        }
    });