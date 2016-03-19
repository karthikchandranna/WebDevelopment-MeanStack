(function() {
    "use strict";
    angular
        .module("FormBuilderApp")
        .controller("FieldController", FieldController);
    function FieldController($routeParams, FieldService, UserService, FormService) {
        var vm = this;
        vm.addField = addField;
        vm.renderModal = renderModal;
        vm.updateField = updateField;
        vm.removeField = removeField;
        vm.field = {};

        function init() {
            vm.formId = $routeParams.formId;
            UserService
                .getCurrentUser()
                .then(function (response) {
                    vm.currentUser = response.data;
                    updateFormFieldsList();
                });
            FormService
                .getFormById(vm.formId)
                .then(function (response) {
                    vm.form = response.data;
                });
        }

        /*
         $scope.$watch('vm.fields', function (newValue, oldValue) {
         if(Object.keys(newValue).length !== 0 && Object.keys(oldValue).length !== 0 ){
         FormService
         .sortFields(vm.formId,newValue)
         .then(function (response) {
         vm.fields = response.data;
         });
         }
         }, true);
         */

        return init();

        function updateFormFieldsList() {
            FieldService
                .getFieldsForForm(vm.formId)
                .then(function (response) {
                    vm.fields = response.data;
                });
        }

        function addField(fieldType) {
            if (!fieldType) return;
            var field = {"type":fieldType};
            switch(fieldType) {
                case "TEXT":
                case "TEXTAREA":
                    field.label="New Text Field";
                    field.placeholder="New Text Field";
                    break;
                case "EMAIL":
                    field.label="New Email Field";
                    field.placeholder="New Email Field";
                    break;
                case "DATE":
                    field.label = "New Date Field";
                    break;
                case "OPTIONS":
                    field.label="New Dropdown";
                    field.options=[
                        {"label": "Option 1", "value": "OPTION_1"},
                        {"label": "Option 2", "value": "OPTION_2"},
                        {"label": "Option 3", "value": "OPTION_3"}
                    ];
                    break;
                case "CHECKBOXES":
                    field.label="New Checkboxes";
                    field.options=[
                        {"label": "Option A", "value": "OPTION_A"},
                        {"label": "Option B", "value": "OPTION_B"},
                        {"label": "Option C", "value": "OPTION_C"}
                    ];
                    break;
                case "RADIOS":
                    field.label="New Radio Buttons";
                    field.options=[
                        {"label": "Option X", "value": "OPTION_X"},
                        {"label": "Option Y", "value": "OPTION_Y"},
                        {"label": "Option Z", "value": "OPTION_Z"}
                    ];
                    break;
            }
            FieldService
                .createFieldForForm(vm.formId, field)
                .then(function (response) {
                    vm.fields = response.data;
                });
        }

        function renderModal(fieldId) {
            var f;
            for (f in vm.fields) {
                if (vm.fields[f]._id === fieldId) {
                    break;
                }
            }
            vm.field = angular.copy(vm.fields[f]);
            if(vm.field.options) {
                vm.field.optionsStr = "";
                for (var o in vm.field.options) {
                    vm.field.optionsStr += vm.field.options[o].label.toString() + ":" +
                        vm.field.options[o].value.toString() + "\n";
                }
            }
            $("#myModal").modal();
        }

        function updateField(newField) {

            if(newField.optionsStr) {
                var newOptions = [];
                var optionLine = vm.field.optionsStr.split("\n");
                for(var o in optionLine) {
                    if (optionLine[o]) {
                        var items = optionLine[o].split(":");
                        var option = {"label": items[0], "value": items[1]};
                        newOptions.push(option);
                    }
                }
                newField.options = newOptions;
                delete newField.optionsStr;
            }

            FieldService
                .updateField(vm.formId, newField._id, newField)
                .then(function (response) {
                    vm.fields = response.data;
                });
        }

        function removeField(fieldId) {
            FieldService
                .deleteFieldFromForm(vm.formId, fieldId)
                .then(function (response) {
                    vm.fields = response.data;
                });
        }
    }
})();
