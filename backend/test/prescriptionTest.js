const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const { 
  updatePrescription,
  getPrescriptions,
  addPrescription,
  deletePrescription 
} = require('../controllers/prescriptionController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

describe('Prescription Controller Tests', () => {
  
  describe('AddPrescription Function Test', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should create a new prescription with patient and pharmacy details successfully', async () => {
      const doctorUser = {
        id: new mongoose.Types.ObjectId(),
        role: 'doctor'
      };

      const req = {
        user: doctorUser,
        body: { 
          prescriptionDate: "2025-08-12", 
          medicationName: "Test Drug", 
          medicationStrength: "500mg", 
          medicationForm: "Capsule",
          directionOfUse: "Take ONE capsule THREE times a day for 5 days",
          quantity: "15", 
          repeats: "0",
          isDispensed: false,
          patientName: "John Doe",
          patientEmail: "john.doe@patient.com",
          pharmacyEmail: "pharmacy@example.com"
        }
      };

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
        isDispensed: false,
        patientName: req.body.patientName,
        patientEmail: req.body.patientEmail,
        pharmacyEmail: req.body.pharmacyEmail,
        dispenseLog: []
      };

      const createStub = sinon.stub(Prescription, 'create').resolves(createdPrescription);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await addPrescription(req, res);

      expect(createStub.calledOnce).to.be.true;
      const createArgs = createStub.firstCall.args[0];
      expect(createArgs.patientName).to.equal('John Doe');
      expect(createArgs.patientEmail).to.equal('john.doe@patient.com');
      expect(createArgs.pharmacyEmail).to.equal('pharmacy@example.com');
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdPrescription)).to.be.true;
    });

    it('should create prescription without pharmacy email (patient choice)', async () => {
      const doctorUser = {
        id: new mongoose.Types.ObjectId(),
        role: 'doctor'
      };

      const req = {
        user: doctorUser,
        body: { 
          prescriptionDate: "2025-08-12", 
          medicationName: "Test Drug", 
          medicationStrength: "500mg", 
          medicationForm: "Tablet",
          directionOfUse: "Take ONE tablet daily",
          quantity: "30", 
          repeats: "2",
          patientName: "Jane Smith",
          patientEmail: "jane.smith@patient.com"
          // pharmacyEmail intentionally omitted as it is optional
        }
      };

      const createdPrescription = { 
        _id: new mongoose.Types.ObjectId(),
        userId: req.user.id,
        ...req.body,
        isDispensed: false,
        pharmacyEmail: undefined,
        dispenseLog: []
      };

      const createStub = sinon.stub(Prescription, 'create').resolves(createdPrescription);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await addPrescription(req, res);

      const createArgs = createStub.firstCall.args[0];
      expect(createArgs.patientName).to.equal('Jane Smith');
      expect(createArgs.patientEmail).to.equal('jane.smith@patient.com');
      expect(createArgs.pharmacyEmail).to.be.undefined;
      expect(res.status.calledWith(201)).to.be.true;
    });

    it('should deny prescription creation for non-doctor users', async () => {
      const patientUser = {
        id: new mongoose.Types.ObjectId(),
        role: 'patient'
      };

      const req = {
        user: patientUser,
        body: { 
          prescriptionDate: "2025-08-12", 
          medicationName: "Test Drug",
          patientName: "Test Patient",
          patientEmail: "test@patient.com"
        }
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await addPrescription(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Only doctors can create prescriptions' })).to.be.true;
    });

    it('should validate required patient email field', async () => {
      const doctorUser = {
        id: new mongoose.Types.ObjectId(),
        role: 'doctor'
      };

      const req = {
        user: doctorUser,
        body: { 
          prescriptionDate: "2025-08-12", 
          medicationName: "Test Drug",
          medicationStrength: "500mg",
          // missing patientEmail and patientName
        }
      };

      const error = new Error('Prescription validation failed: patientEmail is required');
      const createStub = sinon.stub(Prescription, 'create').rejects(error);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await addPrescription(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.firstCall.args[0].message).to.include('required');
    });
  });

  describe('UpdatePrescription Function Test', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should update prescription with new patient and pharmacy details', async () => {
      const userId = new mongoose.Types.ObjectId();
      const prescriptionId = new mongoose.Types.ObjectId();

      const existingPrescription = {
        _id: prescriptionId,
        userId: {
                  toString: () => userId.toHexString()
              },
        medicationName: 'Old Med',
        patientName: 'Old Patient',
        patientEmail: 'old@patient.com',
        pharmacyEmail: '',
        save: sinon.stub()
      };

      // Convert to Mongoose-like object
      // Object.setPrototypeOf(existingPrescription, {
      //   toString: function() { return this._id.toString(); }
      // });
      // existingPrescription.userId.toString = () => userId.toString();
      existingPrescription.save.resolves(existingPrescription);

      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(existingPrescription);

      const req = {
        user: { id: userId.toString() },
        params: { id: prescriptionId },
        body: {
          medicationName: 'Updated Med',
          patientName: 'Updated Patient Name',
          patientEmail: 'updated@patient.com',
          pharmacyEmail: 'newpharmacy@example.com'
        }
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updatePrescription(req, res);

      expect(existingPrescription.medicationName).to.equal('Updated Med');
      expect(existingPrescription.patientName).to.equal('Updated Patient Name');
      expect(existingPrescription.patientEmail).to.equal('updated@patient.com');
      expect(existingPrescription.pharmacyEmail).to.equal('newpharmacy@example.com');
      expect(existingPrescription.save.called).to.be.true;
      expect(res.json.calledWith(existingPrescription)).to.be.true;
    });

    it('should handle pharmacy email removal (clearing assignment)', async () => {
      const userId = new mongoose.Types.ObjectId();
      const prescriptionId = new mongoose.Types.ObjectId();

      const existingPrescription = {
        _id: prescriptionId,
        userId: {
                  toString: () => userId.toHexString()
              },
        pharmacyEmail: 'oldpharmacy@example.com',
        save: sinon.stub()
      };

      // Object.setPrototypeOf(existingPrescription, {
      //   toString: function() { return this._id.toString(); }
      // });
      // existingPrescription.userId.toString = () => userId.toString();
      existingPrescription.save.resolves(existingPrescription);

      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(existingPrescription);

      const req = {
        user: { id: userId.toString() },
        params: { id: prescriptionId },
        body: {
          pharmacyEmail: '' // Clear pharmacy assignment
        }
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updatePrescription(req, res);

      expect(existingPrescription.pharmacyEmail).to.equal('');
      expect(existingPrescription.save.called).to.be.true;
    });
  });

  describe('GetPrescriptions Function Test', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return prescriptions with patient and pharmacy details', async () => {
      const userId = new mongoose.Types.ObjectId();

      const prescriptions = [
        {
          _id: new mongoose.Types.ObjectId(),
          userId: userId,
          medicationName: 'Med 1',
          patientName: 'Patient One',
          patientEmail: 'patient1@test.com',
          pharmacyEmail: 'pharmacy1@test.com'
        },
        {
          _id: new mongoose.Types.ObjectId(),
          userId: userId,
          medicationName: 'Med 2',
          patientName: 'Patient Two',
          patientEmail: 'patient2@test.com',
          pharmacyEmail: '' // no pharmacy assigned
        }
      ];

      const findStub = sinon.stub(Prescription, 'find').resolves(prescriptions);

      const req = { user: { id: userId } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getPrescriptions(req, res);

      expect(findStub.calledWith({ userId: userId })).to.be.true;
      expect(res.json.calledWith(prescriptions)).to.be.true;
      
      const returnedPrescriptions = res.json.firstCall.args[0];
      expect(returnedPrescriptions[0].patientName).to.equal('Patient One');
      expect(returnedPrescriptions[0].pharmacyEmail).to.equal('pharmacy1@test.com');
      expect(returnedPrescriptions[1].pharmacyEmail).to.equal('');
    });
  });

  describe('Integration Tests - Patient & Pharmacy Email Flow', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should handle complete prescription workflow with email notifications', async () => {
      // to validate the full flow:
      // 1. doctor creates prescription with patient/pharmacy emails
      // 2. system should be ready to send notifications
      // 3. pharmacy can query prescriptions by their email

      const doctorId = new mongoose.Types.ObjectId();
      const prescriptionData = {
        prescriptionDate: new Date(),
        medicationName: 'Amoxicillin',
        medicationStrength: '500mg',
        medicationForm: 'Capsule',
        directionOfUse: 'Take 1 capsule 3 times daily',
        quantity: 21,
        repeats: 0,
        patientName: 'Test Patient',
        patientEmail: 'patient@example.com',
        pharmacyEmail: 'pharmacy@example.com'
      };

      const createdPrescription = {
        _id: new mongoose.Types.ObjectId(),
        userId: doctorId,
        ...prescriptionData,
        isDispensed: false,
        dispenseLog: []
      };

      const createStub = sinon.stub(Prescription, 'create').resolves(createdPrescription);

      const req = {
        user: { id: doctorId, role: 'doctor' },
        body: prescriptionData
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await addPrescription(req, res);

      const createArgs = createStub.firstCall.args[0];
      expect(createArgs.patientEmail).to.equal('patient@example.com');
      expect(createArgs.pharmacyEmail).to.equal('pharmacy@example.com');
      
      const findStub = sinon.stub(Prescription, 'find').resolves([createdPrescription]);
      const pharmacyQuery = { pharmacyEmail: 'pharmacy@example.com' };
      const foundPrescriptions = await Prescription.find(pharmacyQuery);
      
      expect(foundPrescriptions).to.have.lengthOf(1);
      expect(foundPrescriptions[0].pharmacyEmail).to.equal('pharmacy@example.com');
    });
  });
});