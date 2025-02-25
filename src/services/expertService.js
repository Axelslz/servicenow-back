const ExpertModel = require('../models/expertModel');

const ExpertService = {
    getAllExperts: () => ExpertModel.getAllExperts(),
    getExpertById: (id) => ExpertModel.getExpertById(id),
    createExpert: (expertData) => ExpertModel.createExpert(expertData),
    updateExpert: (id, expertData) => ExpertModel.updateExpert(id, expertData),
    deleteExpert: (id) => ExpertModel.deleteExpert(id),
    searchExperts: (term) => ExpertModel.searchExperts(term)
};

module.exports = ExpertService;