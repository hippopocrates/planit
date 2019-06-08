const app = angular.module("PlanApp", []);

app.controller("PlanController", [
  "$http",
  function($http) {
    const controller = this;
    this.showAddEventForm = false;
    this.showAddTask = false;
    this.showUpdateForm = false;
    // global variable for planID for adding todos to plan
    this.planID = "";
    // array for todoList
    this.todoList = [];

    this.showCreateUser = false;
    this.showLogInUser = false;

    // variable to hold icon url
    this.iconURL = "";

    // allows for show/hide of icon search iconModal
    this.showIconSearch = image => {
      this.openIconSearchModal = true;
    };

    // search icons API
    this.searchIcons = () => {
      // clears search results before repopulating
      this.iconSearchResults = [];
      $http({
        method: "GET",
        url: `/iconapi/${this.txtSearchIcons}`
      }).then(
        res => {
          // set variable for icons array for view to show
          this.icons = res.data.icons;
        },
        err => {
          console.log(err);
        }
      );
    };

    this.sendIconToDB = icon => {
      // set global iconURL variable to clicked icon url
      this.iconURL = icon;
      // close icon search modal
      this.openIconSearchModal = false;
      // set image input to selected icon url
      this.image = this.iconURL;
    };

    this.indexOfFormToShow = null;
    // create event
    this.createEvent = () => {
      // this.image = this.iconURL
      $http({
        method: "POST",
        url: "/plan",
        data: {
          title: this.title,
          date: this.date,
          location: this.location,
          image: this.image,
          modal: this.modal
        }
      }).then(
        res => {
          // set global planID variable for adding todos
          this.planID = res.data._id;
          // push event into array to display
          this.events.push(res.data);
          // clear input boxes
          this.title = "";
          this.date = "";
          this.location = "";
          this.image = "";
        },
        err => {
          console.log(err);
        }
      );
    };

    this.createTodo = event => {
      $http({
        method: "POST",
        url: "/todo",
        data: {
          taskName: this.taskName,
          dueDate: this.dueDate,
          notes: this.notes
        }
      }).then(
        res => {
          this.todoItem = res.data;
          this.addEventTodos(event._id);
          this.todoList.push(res.data);
          // clear form inputs, this is a total hack way of doing this but its the only way I found that actually worked for me
          this.taskName = "";
          this.dueDate = "";
          this.notes = "";
        },
        err => {
          console.log(err);
        }
      );
    };

    // add todo list items via update
    this.addEventTodos = eventID => {
      $http({
        method: "PUT",
        url: "/plan/" + eventID,
        data: {
          // update plan todo with current todoList
          todos: this.todoList
        }
      }).then(
        res => {
          console.log(res.data);
        },
        err => {
          console.log(err);
        }
      );
    };

    // getting todo items from selected plan by plan id
    this.getPlanTodos = eventID => {
      $http({
        method: "GET",
        url: "/plan/" + eventID
      }).then(
        res => {
          // set variable for returned plan todos
          let planTodos = res.data.todos;
          // for each todo in plan todo key
          for (let i = 0; i < planTodos.length; i++) {
            // push the todo to the global todoList array
            this.todoList.push(planTodos[i]);
          }
        },
        err => {
          console.log(err);
        }
      );
    };

    this.updateEvent = function(event) {
      $http({
        method: "PUT",
        url: "/plan/" + event._id,
        data: {
          title: this.updatedTitle,
          date: this.updatedDate,
          location: this.updatedLocation,
          image: this.updatedImage
        }
      }).then(function(response) {
        controller.showUpdateForm = !controller.showUpdateForm;
        controller.getEvent();
      });
    };

    this.deleteEvent = function(event) {
      $http({
        method: "DELETE",
        url: "/plan/" + event._id
      }).then(
        function(response) {
          controller.getEvent();
        },
        function() {}
      );
    };

    this.getEvent = function() {
      $http({
        method: "GET",
        url: "/plan"
      }).then(function(response) {
        controller.events = response.data;
      });
    };
    this.getEvent();

    this.createUser = function() {
      $http({
        method: "POST",
        url: "/users",
        data: {
          username: this.username,
          password: this.password
        }
      }).then(
        response => {
          this.username = "";
          this.password = "";
        },
        function() {
          console.log("error");
        }
      );
    };

    this.logIn = function() {
      $http({
        method: "POST",
        url: "/sessions",
        data: {
          username: this.usernameLogIn,
          password: this.passwordLogIn
        }
      }).then(
        response => {
          controller.goApp();
          this.usernameLogIn = "";
          this.passwordLogIn = "";
        },
        err => {
          console.log(err);
        }
      );
    };

    // access for users
    this.goApp = function() {
      $http({
        method: "GET",
        url: "/users"
      }).then(
        function(response) {
          controller.loggedInUsername = response.data.username;
        },
        function(err) {
          console.log(err);
        }
      );
    };
    this.goApp();

    this.logOut = function() {
      $http({
        method: "DELETE",
        url: "/sessions"
      }).then(function(response) {
        controller.loggedInUsername = undefined;
      });
    };
  }
]); // this closes PlanController
