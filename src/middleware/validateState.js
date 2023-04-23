const statesData = require('../statesData.json');


function validateStateCode(req, res, next) {
    const stateCode = req.params.state.toUpperCase();
    const stateCodes = statesData.map(state => state.code.toUpperCase());
    if (!stateCodes.includes(stateCode)) {
      return res.status(404).json({ error: 'Invalid state abbreviation code' });
    }
    req.stateCode = stateCode;
    next();
  }