import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './eventAttendees.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

/**
 * EventCreator component
 */
class EventAttendees {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);

    this.list = [];


    var userdb = this.subscribe('users', function() {
      return ['is loaded']
    });

    this.helpers({
      attendees() {

        var cancelations = [];
        var volunteers = [];
        var attendants = [];
        var listName = '';

        if (userdb.ready() != true){
          return "loading"
        }

        if (!this.event || !this.event.rsvps) {
          return 'no attendants';
        }

        var attendantids = this.event.rsvps;

        for (var i = 0 ; i < attendantids.length ; i++) {
          var id = attendantids[i].user
          var name = Meteor.users.findOne(id);

          if (name) {
            listName = name.profile.username
          }else {
            listName = this.event.rsvps[i].user
          }

          if (this.event.rsvps[i].rsvp == "cancel") {
              cancelations.push(listName)
          }else if (this.event.rsvps[i].rsvp == 'volunteer') {
              volunteers.push(listName)
          }else if (this.event.rsvps[i].rsvp == 'yes')
              attendants.push(listName)
          }
        
        if (this.attendtype == 'vol') {
          this.list = volunteers;
        }else if (this.attendtype == 'can') {
          this.list = cancelations;
        }else if (this.attendtype == 'yes') {
          this.list = attendants;
        }

      }
    });
  }
}

const name = 'eventAttendees';

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    attendtype: '<',
    event: '<'
  },
  controller: EventAttendees
});
