module.exports = async function(req, res, proceed) {
  
    // eslint-disable-next-line eqeqeq
    if (req.session.role == 'stationmgr') {
      return proceed(); //proceed to the next policy,
    }
  
    //--•
    // Otherwise, this request did not come from a logged-in user.
    return res.forbidden();
  };