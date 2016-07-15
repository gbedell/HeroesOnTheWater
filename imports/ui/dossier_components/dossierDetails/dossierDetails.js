import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './dossierDetails.html';
import { Events } from '../../../api/events';
import { name as DossierUninvited } from '../dossierUninvited/dossierUninvited';
import { name as DossierMap } from '../dossierMap/dossierMap';
import { name as DossierImage } from '../dossierImage/dossierImage';

import modalTemplate from './profileModifyModal.html';

class DossierDetails {
  constructor($stateParams, $scope, $reactive, $mdDialog, $mdMedia) {
    'ngInject';

    $reactive(this).attach($scope);

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia

    this.subscribe('events');
    this.subscribe('users');
    this.subscribe('images');

    this.helpers({
      event() {
        return Events.findOne({
          _id: $stateParams.dossierId
        });
      },
      user() {
        console.log(Meteor.user())
        return Meteor.user()
      },
      isLoggedIn() {
        return !!Meteor.userId();
      }
    });
  }

    open(dossier) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        //helps pass selected id to modal edit
        this.getval = () => {
          return dossier
        }

        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'profileModifyModal',
      template: modalTemplate,
      targetDossier: dossier,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    })
  }

}

const name = 'dossierDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  DossierUninvited,
  DossierMap,
  DossierImage
]).component(name, {
  template,
  controllerAs: name,
  controller: DossierDetails
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('dossierDetails', {
    url: '/profile',
    template: '<dossier-details></dossier-details>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  });
}