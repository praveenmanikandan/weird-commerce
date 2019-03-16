const store=artifacts.require('./Store');

module.exports=function(deployer){
  deployer.deploy(store);
};
