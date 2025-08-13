
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Prescription = require('../models/Prescription');
const { updatePrescription,getPrescriptions,addPrescription,deletePrescription } = require('../controllers/prescriptionController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddPrescription Function Test', () => {

  it('should create a new prescription successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { 
        prescriptionDate: "2025-08-12", 
        medicationName: "Test Drug", 
        medicationStrength: "500mg", 
        medicationForm: "Capsule",
        directionOfUse: "Take ONE capsule THREE times a day for 5 days",
        quantity: "15", 
        repeats: "0",
        isDispensed: false
        }
    };

    // Mock prescription that would be created
    const createdPrescription = { 
        _id: new mongoose.Types.ObjectId(),
        userId: req.user.id, 
        prescriptionDate: req.body.prescriptionDate,
        medicationName: req.body.medicationName,
        medicationStrength: req.body.medicationStrength,
        medicationForm: req.body.medicationForm,
        directionOfUse: req.body.directionOfUse,
        quantity: req.body.quantity,
        repeats: req.body.repeats,
        isDispensed: false};

    // Stub Prescription.create to return the createdPrescription
    const createStub = sinon.stub(Prescription, 'create').resolves(createdPrescription);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addPrescription(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdPrescription)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Prescription.create to throw an error
    const createStub = sinon.stub(Prescription, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { 
        prescriptionDate: "2025-08-12", 
        medicationName: "Test Drug", 
        medicationStrength: "500mg", 
        medicationForm: "Capsule",
        directionOfUse: "Take ONE capsule THREE times a day for 5 days",
        quantity: "15", 
        repeats: "0"
        }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addPrescription(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update Prescription successfully', async () => {
    // Mock Prescription data
    const prescriptionId = new mongoose.Types.ObjectId();
    const existingPrescription = {
      _id: prescriptionId,
      prescriptionDate: "2025-08-10",
      medicationName: "Old Drug",
      medicationStrength: "100mg",
      medicationForm: "Tablet",
      directionOfUse: "Take ONE tablet THREE times a day for 5 days",
      quantity: "0", 
      repeats: "0", 
      isDispensed: false,
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Prescription.findById to return mock prescription
    const findByIdStub = sinon.stub(Prescription, 'findById').resolves(existingPrescription);

    // Mock request & response
    const req = {
      params: { id: prescriptionId },
      body: { medicationName: "New Drug", isDispensed: true }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updatePrescription(req, res);

    // Assertions
    expect(existingPrescription.medicationName).to.equal("New Drug");
    expect(existingPrescription.isDispensed).to.equal(true);
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if prescription is not found', async () => {
    const findByIdStub = sinon.stub(Prescription, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updatePrescription(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Prescription not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Prescription, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updatePrescription(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

});



describe('GetPrescription Function Test', () => {

  it('should return prescriptions for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock prescription data
    const prescriptions = [
      { _id: new mongoose.Types.ObjectId(), medicationName: "Drug 1", userId },
      { _id: new mongoose.Types.ObjectId(), medicationName: "Drug 2", userId }
    ];

    // Stub Prescription.find to return mock prescriptions
    const findStub = sinon.stub(Prescription, 'find').resolves(prescriptions);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getPrescriptions(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(prescriptions)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Prescription.find to throw an error
    const findStub = sinon.stub(Prescription, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getPrescriptions(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeletePrescription Function Test', () => {

  it('should delete a prescription successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock prescription found in the database
    //const prescription = { remove: sinon.stub().resolves() };
    const prescription = { _id: req.params.id, medicationName: "Test Drug" };

    // Stub Prescription.findById to return the mock prescription
    const findByIdStub = sinon.stub(Prescription, 'findById').resolves(prescription);
    const findByIdAndDeleteStub = sinon.stub(Prescription, 'findByIdAndDelete').resolves(prescription);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deletePrescription(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(findByIdAndDeleteStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.json.calledWith({ message: 'Prescription deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if prescription is not found', async () => {
    // Stub Prescription.findById to return null
    const findByIdStub = sinon.stub(Prescription, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deletePrescription(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Prescription not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Prescription.findById to throw an error
    const findByIdStub = sinon.stub(Prescription, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deletePrescription(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});