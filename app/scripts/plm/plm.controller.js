angular.module('nutritionApp')
    .controller('plmController', plmController);


function plmController($http, $mdEditDialog, $q, $timeout, $scope){
    'use strict';



    $scope.boms = [];

    /**
     * Master table selection
     * @type {Array}
     */
    $scope.selectedRow = [];

    $scope.query = {
        order: 'objectNumber',
        limit: 5,
        page: 1
    };

    $scope.limitOptions = [5, 15, 25, {
        label: 'All',
        value: function () {
            return $scope.boms.length>0 ? $scope.boms.length : 0;
        }
    }];

    $scope.options = {
        rowSelection: false,
        multiSelect: false,
        autoSelect: false,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true
    };

    /**
     * first child config start
     * @type {Array}
     */
    $scope.firsTableSelectedRow = [];

    $scope.firsTableQuery = angular.copy($scope.query);

    $scope.firsTableLimitOptions = angular.copy($scope.limitOptions);

    $scope.firsTableOptions = angular.copy($scope.options);


    $scope.getListFromBomResponse = function( d ){debugger;
        return (d||[]);
    }


    $http.get('bom.json').then(function (boms) {
        $scope.boms = boms.data.data;
    });


    $scope.onPaginate = function (page, limit) {
        console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
        console.log('Page: ' + page + ' Limit: ' + limit);

        $scope.promise = $timeout(function () {

        }, 2000);
    }

    /**
     * build sourcing list based on the
     * @param sourceList
     * @returns {Array}
     */
    $scope.buildSourcingList = function (sourceList) {
        sourceList = sourceList || [];
        var array = [];

        var props = {
            manufacturerName: '',
            manufacturerPartNumber: '',
            name: '',
            sourcingPartNumber: ''
        };

        var manufactures = [];
        var suppliers = [];

        angular.forEach(sourceList, function (value, key) {
            if (value.type === "manufacturer") {
                manufactures.push(value);
            }
            if (value.type === "supplier") {
                suppliers.push(value);
            }
        });

        // first call
        angular.forEach(manufactures, function (m, k) {
            var match = false;
            angular.forEach(suppliers, function (s, t) {
                if (m.name === s.manufacturerName && m.sourcingPartNumber === s.manufacturerPartNumber) {
                    var clone = angular.copy(props);
                    clone.manufacturerName = m.name;
                    clone.manufacturerPartNumber = m.sourcingPartNumber;
                    clone.name = s.name;
                    clone.sourcingPartNumber = s.sourcingPartNumber;
                    array.push(clone);
                    match = true;
                }
            });

            if (!match) {
                var clone = angular.copy(props);
                clone.manufacturerName = m.name;
                clone.manufacturerPartNumber = m.sourcingPartNumber;
                array.push(clone);
            }
        });

        angular.forEach(suppliers, function (s, k) {
            var match = false;
            angular.forEach(manufactures, function (m, t) {
                if (s.manufacturerName === m.name && s.manufacturerPartNumber === m.sourcingPartNumber) {
                    var clone = angular.copy(props);
                    clone.manufacturerName = m.name;
                    clone.manufacturerPartNumber = m.sourcingPartNumber;
                    clone.name = s.name;
                    clone.sourcingPartNumber = s.sourcingPartNumber;
                    if (!$scope.doesExistObjectInArray(array, clone)) {
                        array.push(clone);
                    }
                    match = true;
                }
            });

            if (!match) {
                var clone = angular.copy(props);
                clone.manufacturerName = s.manufacturerName;
                clone.manufacturerPartNumber = s.manufacturerPartNumber;
                clone.name = s.name;
                clone.sourcingPartNumber = s.sourcingPartNumber;
                if (!$scope.doesExistObjectInArray(array, clone)) {
                    array.push(clone);
                }

            }
        });

        return array;
    }


    /**
     * does Exist Object InArray
     * @param arr
     * @param o
     * @returns {boolean}- true - exist, false - not exist
     */
    $scope.doesExistObjectInArray = function (arr, o) {
        arr = arr || [];
        var exist = false;
        angular.forEach(arr, function (i, k) {
            if ($scope.isEquivalent(i, o)) {
                exist = true;
            }
        });
        return exist;
    }


    /**
     * check object equality
     * @param a - first object
     * @param b - second object
     * @returns {boolean} - true - equal, false - not equal
     */
    $scope.isEquivalent = function (a, b) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }

    /**
     * validate sourcing record existance
     * @param sourceList
     * @returns {boolean} - true - exist , false - not exist
     */
    $scope.hasSourcingRecord = function (sourceList) {
        sourceList = sourceList || [];
        if (sourceList.length > 0) {
            return true;
        }
        return false;
    }

}