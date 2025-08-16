const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const {
  getPharmacyPrescriptions,
  dispensePrescription,
  updateDispenseLog
} = require('../controllers/pharmacyController');
const { expect } = chai;

describe('Pharmacy Controller Tests', () => {
  
  describe('getPharmacyPrescriptions', () => {
    it('should return prescriptions for pharmacy user', async () => {
      // Mock pharmacy user
      const pharmacyUser = {
        id: new mongoose.Types.ObjectId(),
        email: 'pharmacy@test.com',
        role: 'pharmacy'
      };

      // Mock prescriptions
      const prescriptions = [
        {
          _id: new mongoose.Types.ObjectId(),
          medicationName: 'Test Med 1',
          pharmacyEmail: 'pharmacy@test.com',
          patientEmail: 'patient@test.com'
        }
      ];

      // Stub the find and populate
      const populateStub = sinon.stub().resolves(prescriptions);
      const findStub = sinon.stub(Prescription, 'find').returns({ populate: populateStub });

      // Mock request and response
      const req = { user: pharmacyUser };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await getPharmacyPrescriptions(req, res);

      // Assertions
      expect(findStub.calledWith({ pharmacyEmail: 'pharmacy@test.com' })).to.be.true;
      expect(res.json.calledWith(prescriptions)).to.be.true;

      // Cleanup
      findStub.restore();
    });

    it('should deny access for non-pharmacy users', async () => {
      // Mock non-pharmacy user
      const regularUser = {
        id: new mongoose.Types.ObjectId(),
        email: 'user@test.com',
        role: 'patient'
      };

      // Mock request and response
      const req = { user: regularUser };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await getPharmacyPrescriptions(req, res);

      // Assertions
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Access denied. Pharmacy only.' })).to.be.true;
    });
  });

  describe('dispensePrescription', () => {
    it('should successfully dispense a prescription', async () => {
      // Mock pharmacy user
      const pharmacyUser = {
        id: new mongoose.Types.ObjectId(),
        name: 'Test Pharmacy',
        role: 'pharmacy'
      };

      // Mock prescription
      const prescription = {
        _id: new mongoose.Types.ObjectId(),
        medicationName: 'Test Med',
        quantity: 30,
        isDispensed: false,
        dispenseLog: [],
        save: sinon.stub().resolves()
      };

      // Stub findById
      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(prescription);

      // Mock request and response
      const req = {
        user: pharmacyUser,
        params: { prescriptionId: prescription._id },
        body: {
          quantityDispensed: 30,
          notes: 'Test dispense',
          status: 'fully-dispensed'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await dispensePrescription(req, res);

      // Assertions
      expect(prescription.dispenseLog).to.have.lengthOf(1);
      expect(prescription.dispenseLog[0].dispensedBy).to.equal(pharmacyUser.id);
      expect(prescription.dispenseLog[0].quantityDispensed).to.equal(30);
      expect(prescription.isDispensed).to.be.true;
      expect(prescription.save.called).to.be.true;
      expect(res.json.called).to.be.true;

      // Cleanup
      findByIdStub.restore();
    });

    it('should return 404 if prescription not found', async () => {
      // Mock pharmacy user
      const pharmacyUser = {
        id: new mongoose.Types.ObjectId(),
        role: 'pharmacy'
      };

      // Stub findById to return null
      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(null);

      // Mock request and response
      const req = {
        user: pharmacyUser,
        params: { prescriptionId: new mongoose.Types.ObjectId() },
        body: {}
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // Call the function
      await dispensePrescription(req, res);

      // Assertions
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Prescription not found' })).to.be.true;

      // Cleanup
      findByIdStub.restore();
    });
  });

  describe('updateDispenseLog', () => {
    it('should update dispense log entry', async () => {
      const pharmacyUser = {
        id: new mongoose.Types.ObjectId().toString(),
        role: 'pharmacy'
      };

      const logId = new mongoose.Types.ObjectId();
      const prescription = {
        _id: new mongoose.Types.ObjectId(),
        isDispensed: false,
        dispenseLog: {
          id: sinon.stub().returns({
            _id: logId,
            dispensedBy: mongoose.Types.ObjectId(pharmacyUser.id),
            quantityDispensed: 15,
            notes: 'Initial note',
            status: 'partially-dispensed'
          })
        },
        save: sinon.stub().resolves()
      };

      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(prescription);

      const req = {
        user: pharmacyUser,
        params: { 
          prescriptionId: prescription._id,
          logId: logId
        },
        body: {
          quantityDispensed: 30,
          notes: 'Updated note',
          status: 'fully-dispensed'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updateDispenseLog(req, res);

      expect(prescription.save.called).to.be.true;
      expect(res.json.called).to.be.true;

      findByIdStub.restore();
    });
  });
});