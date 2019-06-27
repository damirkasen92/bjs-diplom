class Profile {
  constructor({
    username,
    name: { firstName, lastName },
    password,
  }) {
    this.username = username;
    this.name = { firstName, lastName };
    this.password = password; 
  }
  
  createUser(callback) {
    return ApiConnector.createUser({username: this.username, name: this.name, password: this.password}, (err, data) => {
      console.log(`Creating user ${this.username}`);
      callback(err, data);
    });
  }
  
  performLogin(callback) {
    return ApiConnector.performLogin({username: this.username, password: this.password}, (err, data) => {
      console.log(`Authorizing user ${this.username}`);  
      callback(err, data);
    });
  }  
  
  addMoney({currency, amount}, callback) {
    return ApiConnector.addMoney({currency, amount}, (err, data) => {
      console.log(`Adding ${amount} of ${currency} to ${this.username}`);  
      callback(err, data);
    });  
  }
  
  convertMoney({fromCurrency, targetCurrency, targetAmount}, callback) {
    return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
      console.log(`Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`);  
      callback(err, data);
    });   
  }
  
  transferMoney({to, amount}, callback) {
    return ApiConnector.transferMoney({ to, amount }, (err, data) => {
      console.log(`Transfering ${amount} of NETCOIN to ${to}`);
      callback(err, data);
    });
  }
}
  
function getStocks(callback) {
  return ApiConnector.getStocks((err, data) => {
    console.log(`Getting stocks info`);  
    callback(err, data);
  });   
}

function main() {

  const David = new Profile({
    username: 'david',
    name: { firstName: 'David', lastName: 'Black' },
    password: 'davidspass',
  });

  const Rick = new Profile({
    username: 'rick',
    name: { firstName: 'Rick', lastName: 'Silver' },
    password: 'rickspass',
  });      
                
    const addAmount = {currency: 'EUR', amount: 50000};

    getStocks((err, data) => {
      if (err) {
        console.log('Error during getting stocks');
      }
        
      const getStock = data[99];        
        
        David.createUser((err, data) => {
          if (err) {
            console.log(`Error during creating ${David.username}`);
          } else {
            console.log(`User ${David.username} successfully created`);

            David.performLogin((err, data) => {
              if (err) {
                console.log(`Error during logging in ${David.username}`);
              } else {
                console.log(`User ${David.username} successfully logging in`);
    
                David.addMoney(addAmount, (err, data) => {
                  if (err) {
                    console.error(`Error during adding money to ${David.username}`);
                  } else {
                    console.log(`Added ${addAmount.amount} ${addAmount.currency} to ${David.username}`);

                    const getConvertAmount = getStock['EUR_NETCOIN'] * addAmount.amount;  

                    David.convertMoney({ fromCurrency: addAmount.currency, targetCurrency: 'NETCOIN', targetAmount: getConvertAmount }, (err, data) => {
                      if (err) {
                        console.log(`Error converting money from  ${addAmount.currency} to NETCOIN`);
                      } else {
                        console.log(`Successfully converted ${addAmount.amount} ${addAmount.currency} to ${getConvertAmount} NETCOIN`);
                                       
                        Rick.createUser((err, data) => {
                          if (err) {
                            console.log(`Error during creating ${Rick.username}`);
                          } else {
                            console.log(`User ${Rick.username} successfully created`);
                                                
                            David.transferMoney({ to: Rick.username, amount: getConvertAmount }, (err, data) => {
                              if (err) {
                                console.log(`Error during transfer money to ${Rick.username}`);
                              } else {
                                console.log(`Successfully transfered ${getConvertAmount} NETCOIN to ${Rick.username}`);
                              }
                            });            
                          }
                        });    
                      }
                    });            
                  }
                });                    
              }
            });        
          }
        });
    });
}

main();