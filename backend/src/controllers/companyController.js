const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res) => {
  try {
    const { search, industry } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (industry && industry !== 'All') {
      query.industry = { $regex: industry, $options: 'i' };
    }

    const companies = await Company.find(query).sort({ createdAt: -1 });

    // Get job counts for each company
    const companiesWithJobCount = await Promise.all(
      companies.map(async (company) => {
        const jobCount = await Job.countDocuments({ 
          company: company.name,
          isActive: true 
        });
        return {
          ...company.toObject(),
          jobCount
        };
      })
    );

    res.json(companiesWithJobCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (company) {
      const jobCount = await Job.countDocuments({ 
        company: company.name,
        isActive: true 
      });
      res.json({
        ...company.toObject(),
        jobCount
      });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a company
// @route   POST /api/companies
// @access  Private/Admin
const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    const createdCompany = await company.save();
    res.status(201).json(createdCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private/Admin
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      const updatedCompany = await Company.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      res.json(updatedCompany);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      await company.deleteOne();
      res.json({ message: 'Company removed' });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};

