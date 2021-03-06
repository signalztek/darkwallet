/**
 * @fileOverview PocketCreateCtrl angular controller
 */
'use strict';

define(['./module', 'darkwallet'], function (controllers, DarkWallet) {
  controllers.controller('PocketCreateCtrl', ['$scope', '$wallet', '$history', 'watch', '$tabs', 'modals', 'notify', '_Filter', function($scope, $wallet, $history, watch, $tabs, modals, notify, _) {

    /**
     * Scope variables
     */
    $scope.newPocket = {};


    /**
     * Create a pocket
     */
    $scope.createPocket = function() {
        if ($scope.newPocket.name) {
            var identity = DarkWallet.getIdentity();
            // Don't need the password for old style
            var askPassword = (identity.store.get('version') > 4) ? modals.password : function(title, cb) {cb();};
            askPassword('Write your unlock password', function(password) {

                // create pocket
                try {
                    identity.wallet.pockets.createPocket($scope.newPocket.name, password);
                } catch (e) {
                    if (e.message.slice(0,4)==='ccm:') {
                        notify.warning(_('Invalid Password'));
                    } else {
                        notify.warning(e.message);
                    }
                    return;
                }
                var pocketIndex = identity.wallet.pockets.hdPockets.length-1;

                // generate an address
                $wallet.generateAddress(pocketIndex, 0);

                // select the pocket
                $scope.selectPocket($scope.newPocket.name, pocketIndex);

                // reset pocket form
                $scope.newPocket = {name:''};
            });
        } else {
            // cancel
            $tabs.open();
        }
    };
}]);
});
