const statesData = require('../statesData.json');
const State = require('../model/State');



exports.getStates = async (req, res) => {
    try {
      const isContiguous = req.query.contig === 'true';
      const isNoncontiguous = req.query.contig === 'false';
  
      // Retrieve state data from MongoDB
      const statesFromDb = await State.find();  
  
      // Filter state data based on contiguous status
      const stateData = isContiguous ? 
        statesData.filter(state => state.code !== 'AK' && state.code !== 'HI') :
        isNoncontiguous ? statesData.filter(state => state.code == 'AK' || state.code == 'HI') : statesData
        ;
  
      // Add funfacts to state data from MongoDB
      stateData.forEach(state => {
        const stateCode = state.code;
        const stateWithFacts = statesFromDb.find(state => state.stateCode === stateCode);
        state.funfacts = stateWithFacts ? stateWithFacts.funfacts : [];
      });
      res.json(stateData);
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  exports.getState = async (req, res) => {
    try {
      const stateCode = req.params.state.toUpperCase();
  
      // Find state in statesData array
      const state = statesData.find(state => state.code === stateCode);
  
      // Find state in MongoDB and add funfacts
      const stateFromDb = await State.findOne({ stateCode });
      if (stateFromDb) {
        state.funfacts = stateFromDb.funfacts;
      }
  
      res.json(state);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  exports.getFunFact = async (req, res) => {
    try {
      const stateCode = req.params.state.toUpperCase();
  
      // Find state in MongoDB
      const stateFromDb = await State.findOne({ stateCode });
      if (!stateFromDb) {
        return res.status(404).json({ error: 'State not found' });
      }
  
      // Choose random funfact
      const funfacts = stateFromDb.funfacts;
      const randomIndex = Math.floor(Math.random() * funfacts.length);
      const funfact = funfacts[randomIndex];
  
      // Respond with funfact or appropriate message
      if (funfact) {
        res.json({ funfact });
      } else {
        res.json({ message: 'No fun facts found for this state' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  exports.getCapital = (req, res) => {
    try {
      const stateCode = req.params.state.toUpperCase();
  
      // Find state in statesData.json
      const stateFromData = statesData.find(state => state.code === stateCode);
      if (!stateFromData) {
        return res.status(404).json({ error: 'State not found' });
      }
  
      // Respond with state and capital
      res.json({ state: stateFromData.state, capital: stateFromData.capital });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  exports.getNickname = (req, res) => {
    try {
      const stateCode = req.params.state.toUpperCase();
  
      // Find state in statesData.json
      const stateFromData = statesData.find(state => state.code === stateCode);
      if (!stateFromData) {
        return res.status(404).json({ error: 'State not found' });
      }
  
      // Respond with state and nickname
      res.json({ state: stateFromData.state, nickname: stateFromData.nickname });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  exports.getPopulation = (req, res) => {
    try {
      const stateCode = req.params.state.toUpperCase();
  
      // Find state in statesData.json
      const stateFromData = statesData.find(state => state.code === stateCode);
      if (!stateFromData) {
        return res.status(404).json({ error: 'State not found' });
      }
  
      // Respond with state and population
      res.json({ state: stateFromData.state, population: stateFromData.population });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  exports.getAdmission = (req, res) => {
    try {
      const stateCode = req.params.state.toUpperCase();
  
      // Find state in statesData.json
      const stateFromData = statesData.find(state => state.code === stateCode);
      if (!stateFromData) {
        return res.status(404).json({ error: 'State not found' });
      }
  
      // Respond with state and admission date
      res.json({ state: stateFromData.state, admitted: stateFromData.admission_date });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  // POST //

  exports.createFunFact = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.body);

      const stateCode = req.params.state.toUpperCase();
      const funFacts = req.body.funfacts;
  
      // Find state in MongoDB
      const stateFromDb = await State.findOne({ stateCode });
      if (!stateFromDb) {
        return res.status(404).json({ error: 'State not found' });
      }
  
      // Add new fun facts to existing ones
      const existingFacts = stateFromDb.funfacts ? stateFromDb.funfacts : [];
      const newFacts = funFacts;
      const allFacts = [...existingFacts, ...newFacts]; // Remove duplicates
  
      // Update state with new fun facts
      const updatedState = await State.findOneAndUpdate({ stateCode }, { funfacts: allFacts }, { new: true });
  
      // Respond with updated state
      res.json(updatedState);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  exports.updateFunFact = async (req, res) => {
    try {
      const stateCode = req.params.state.toUpperCase();
      const funFact = req.body.funfact;
      const index = req.body.index;

      if(!index || !funFact) return res.json({ error: "Missing required property"});
  
      // Find state in MongoDB
      const stateFromDb = await State.findOne({ stateCode });
      if (!stateFromDb) {
        return res.json({ error: 'State not found' });
      }
  
      // Find index and update it 
      let funfacts = stateFromDb.funfacts;
      let factToUpdate = stateFromDb.funfacts[index-1];
      if (!factToUpdate) return res.json({ error: "Index does not exist"});

      funfacts[index - 1] = funFact;
      
  
      // Update state with new fun facts
      const updatedState = await State.findOneAndUpdate({ stateCode }, { funfacts: funfacts }, { new: true });
  
      // Respond with updated state
      res.json(updatedState);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  exports.deleteFunFact = async (req, res) => {
    try {
      const stateCode = req.params.state.toUpperCase();
      const index = req.body.index;

      if(!index) return res.json({ error: "Missing index property"});
  
      // Find state in MongoDB
      const stateFromDb = await State.findOne({ stateCode });
      if (!stateFromDb) {
        return res.status(404).json({ error: 'State not found' });
      }
  
      // Find index and delete it 
      let funfacts = stateFromDb.funfacts;
      const factToDelete = stateFromDb.funfacts[index-1];
      if (!factToDelete) return res.json({ error: "Index does not exist"});

        funfacts = stateFromDb.funfacts.filter((fact)=> fact!=factToDelete);
      
  
      // Update state with new fun facts
      const updatedState = await State.findOneAndUpdate({ stateCode }, { funfacts: funfacts }, { new: true });
  
      // Respond with updated state
      res.json(updatedState);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };
