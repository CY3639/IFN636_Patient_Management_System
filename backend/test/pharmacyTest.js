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
      const pharmacyUser = {
        id: new mongoose.Types.ObjectId(),
        email: 'pharmacy@test.com',
        role: 'pharmacy'
      };

      const prescriptions = [
        {
          _id: new mongoose.Types.ObjectId(),
          medicationName: 'Test Med 1',
          pharmacyEmail: 'pharmacy@test.com',
          patientEmail: 'patient@test.com'
        }
      ];

      const populateStub = sinon.stub().resolves(prescriptions);
      const findStub = sinon.stub(Prescription, 'find').returns({ populate: populateStub });

      const req = { user: pharmacyUser };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getPharmacyPrescriptions(req, res);

      expect(findStub.calledWith({ pharmacyEmail: 'pharmacy@test.com' })).to.be.true;
      expect(res.json.calledWith(prescriptions)).to.be.true;

      findStub.restore();
    });

    it('should deny access for non-pharmacy users', async () => {
      const regularUser = {
        id: new mongoose.Types.ObjectId(),
        email: 'user@test.com',
        role: 'patient'
      };

      const req = { user: regularUser };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getPharmacyPrescriptions(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Access denied. Pharmacy only.' })).to.be.true;
    });
  });

  describe('dispensePrescription', () => {
    it('should successfully dispense a prescription', async () => {
      const pharmacyUser = {
        id: new mongoose.Types.ObjectId(),
        name: 'Test Pharmacy',
        role: 'pharmacy'
      };

      const mockPrescription = {
        _id: new mongoose.Types.ObjectId(),
        medicationName: 'Test Med',
        quantity: 30,
        isDispensed: false,
        dispenseLog: [],
        save: sinon.stub()
      };

      mockPrescription.dispenseLog.push = function(entry) {
        Array.prototype.push.call(this, entry);
        if (entry.status === 'Dispensed') {
          mockPrescription.isDispensed = true;
        }
      };

      mockPrescription.save.resolves(mockPrescription);

      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(mockPrescription);

      const req = {
        user: pharmacyUser,
        params: { prescriptionId: mockPrescription._id },
        body: {
          quantityDispensed: 30,
          status: 'Dispensed'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await dispensePrescription(req, res);

      expect(mockPrescription.dispenseLog).to.have.lengthOf(1);
      expect(mockPrescription.dispenseLog[0].dispensedBy).to.equal(pharmacyUser.id);
      expect(mockPrescription.dispenseLog[0].quantityDispensed).to.equal(30);
      expect(mockPrescription.dispenseLog[0].status).to.equal('Dispensed');
      expect(mockPrescription.isDispensed).to.be.true;
      expect(mockPrescription.save.called).to.be.true;
      expect(res.json.called).to.be.true;

      findByIdStub.restore();
    });

    it('should return 404 if prescription not found', async () => {
      const pharmacyUser = {
        id: new mongoose.Types.ObjectId(),
        role: 'pharmacy'
      };

      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(null);

      const req = {
        user: pharmacyUser,
        params: { prescriptionId: new mongoose.Types.ObjectId() },
        body: {}
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await dispensePrescription(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Prescription not found' })).to.be.true;

      findByIdStub.restore();
    });

    it('should handle dispense correctly', async () => {
      const pharmacyUser = {
        id: new mongoose.Types.ObjectId(),
        name: 'Test Pharmacy',
        role: 'pharmacy'
      };

      const mockPrescription = {
        _id: new mongoose.Types.ObjectId(),
        medicationName: 'Test Med',
        quantity: 30,
        isDispensed: false,
        dispenseLog: [],
        save: sinon.stub()
      };

      mockPrescription.dispenseLog.push = function(entry) {
        Array.prototype.push.call(this, entry);
        if (entry.status === 'Dispensed') {
          mockPrescription.isDispensed = true;
        }
      };

      mockPrescription.save.resolves(mockPrescription);

      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(mockPrescription);

      const req = {
        user: pharmacyUser,
        params: { prescriptionId: mockPrescription._id },
        body: {
          quantityDispensed: 15,
          status: 'Dispensed'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await dispensePrescription(req, res);

      findByIdStub.restore();
    });
  });

  describe('updateDispenseLog', () => {
    it('should update dispense log entry', async () => {
      const pharmacyUserId = new mongoose.Types.ObjectId();
      const pharmacyUser = {
        id: pharmacyUserId.toString(),
        role: 'pharmacy'
      };

      const logId = new mongoose.Types.ObjectId();
      
      const logEntry = {
        _id: logId,
        dispensedBy: pharmacyUserId,
        quantityDispensed: 15,
        status: 'Dispensed'
      };

      const mockPrescription = {
        _id: new mongoose.Types.ObjectId(),
        isDispensed: false,
        dispenseLog: {
          id: sinon.stub().returns(logEntry)
        },
        save: sinon.stub()
      };

      mockPrescription.save.callsFake(function() {
        if (logEntry.status === 'Dispensed') {
          mockPrescription.isDispensed = true;
        }
        return Promise.resolve(mockPrescription);
      });

      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(mockPrescription);

      const req = {
        user: pharmacyUser,
        params: { 
          prescriptionId: mockPrescription._id,
          logId: logId
        },
        body: {
          quantityDispensed: 30,
          status: 'Dispensed'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updateDispenseLog(req, res);

      expect(logEntry.quantityDispensed).to.equal(30);
      expect(logEntry.status).to.equal('Dispensed');
      expect(mockPrescription.isDispensed).to.be.true;
      expect(mockPrescription.save.called).to.be.true;
      expect(res.json.called).to.be.true;

      findByIdStub.restore();
    });

    it('should return 403 if user did not create the log entry', async () => {
      const pharmacyUserId = new mongoose.Types.ObjectId();
      const differentUserId = new mongoose.Types.ObjectId();
      const pharmacyUser = {
        id: pharmacyUserId.toString(),
        role: 'pharmacy'
      };

      const logId = new mongoose.Types.ObjectId();
      const logEntry = {
        _id: logId,
        dispensedBy: differentUserId,
        quantityDispensed: 15,
        status: 'Dispensed'
      };

      const mockPrescription = {
        _id: new mongoose.Types.ObjectId(),
        isDispensed: false,
        dispenseLog: {
          id: sinon.stub().returns(logEntry)
        },
        save: sinon.stub().resolves()
      };

      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(mockPrescription);

      const req = {
        user: pharmacyUser,
        params: { 
          prescriptionId: mockPrescription._id,
          logId: logId
        },
        body: {
          quantityDispensed: 30,
          status: 'Dispensed'
        }
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updateDispenseLog(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'You can only edit your own dispense logs' })).to.be.true;

      findByIdStub.restore();
    });

    it('should return 404 if log entry not found', async () => {
      const pharmacyUser = {
        id: new mongoose.Types.ObjectId().toString(),
        role: 'pharmacy'
      };

      const mockPrescription = {
        _id: new mongoose.Types.ObjectId(),
        isDispensed: false,
        dispenseLog: {
          id: sinon.stub().returns(null)
        },
        save: sinon.stub().resolves()
      };

      const findByIdStub = sinon.stub(Prescription, 'findById').resolves(mockPrescription);

      const req = {
        user: pharmacyUser,
        params: { 
          prescriptionId: mockPrescription._id,
          logId: new mongoose.Types.ObjectId()
        },
        body: {}
      };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await updateDispenseLog(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Dispense log entry not found' })).to.be.true;
      
      findByIdStub.restore();
    });
  });
});