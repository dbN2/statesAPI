const express = require('express');
const router = express.Router();
const {getStates, 
  getState, 
  getFunFact, 
  getCapital, 
  getNickname,
  getPopulation,
  getAdmission,
  createFunFact,
  updateFunFact,
  deleteFunFact
  } = require('../controllers/statesController');


router.get('/', getStates);
  
router.get('/:state',getState);

router.get('/:state/funfact', getFunFact);
  
router.get('/:state/capital', getCapital);

router.get('/:state/nickname', getNickname);

router.get('/:state/population', getPopulation);

router.get('/:state/admission', getAdmission);

router.post('/:state/funfact', createFunFact);

router.patch('/:state/funfact', updateFunFact);

router.delete('/:state/funfact', deleteFunFact);

module.exports = router;