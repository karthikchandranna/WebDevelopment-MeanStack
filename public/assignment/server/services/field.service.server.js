module.exports = function(app, fieldModel) {

    app.post("/api/assignment/form/:formId/field", createFieldForForm);
    app.get("/api/assignment/form/:formId/field", getFieldsForForm);
    app.get("/api/assignment/form/:formId/field/:fieldId", getFieldById);
    app.put("/api/assignment/form/:formId/field/:fieldId", updateField);
    app.delete("/api/assignment/form/:formId/field/:fieldId", deleteField);

    function createFieldForForm(req, res) {
        var field = req.body;
        var formId = req.params.formId;
        field = fieldModel.createFieldForForm(formId, field);
        res.json(field);
    }

    function getFieldsForForm (req, res) {
        var formId = req.params.formId;
        var fields = fieldModel.findFieldsForForm(formId);
        res.json(fields);
    }

    function getFieldById (req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        var field = fieldModel.findFieldForForm(formId, fieldId);
        res.json(field);
    }

    function updateField (req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        var field = req.body;
        field = fieldModel.updateField(formId, fieldId, field);
        if(field) {
            res.json(field);
            return;
        }
        res.json({message: "Field not found"});
    }

    function deleteField (req, res) {
        var formId = req.params.formId;
        var fieldId = req.params.fieldId;
        if(fieldModel.deleteFieldFromForm(formId, fieldId)) {
            res.send(200);
            return;
        }
        res.json ({message: "Field not found"});
    }

};