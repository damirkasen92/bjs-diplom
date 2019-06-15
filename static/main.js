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
      console.log(`Создание нового пользователя ${this.username}`);
      callback(err, data);
    });
  }
  
  performLogin(callback) {
    return ApiConnector.performLogin({username: this.username, password: this.password}, (err, data) => {
      console.log(`Авторизация пользователя ${this.username}`);  
      callback(err, data);
    });
  }  
  
  addMoney({currency, amount}, callback) {
    return ApiConnector.addMoney({currency, amount}, (err, data) => {
      console.log(`Adding ${amount} of ${currency} to ${this.username}`);  
      callback(err, data);
    });  
  }
  
  convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
    return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
      console.log(`From ${fromCurrency} to ${targetCurrency}`);  
      callback(err, data);
    });   
  }
  
  transferMoney({ to, amount }, callback) {
    return ApiConnector.transferMoney({ to, amount }, (err, data) => {
      console.log(`Transfering ${amount} of money to ${to}`);
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
  
  const Petya = new Profile({
    username: 'Petya',
    name: {
      firstName: 'Petya',
      lastName: 'Petrov'  
    },
    password: 'www'
  });
  
  const Vasya = new Profile({
    username: 'Vasya',
    name: {
      firstName: 'Vasya',
      lastName: 'Vasyatka'  
    },
    password: 'sss'
  });
    
  getStocks((err,data) => {
    if (err) {
      console.log(`getStocks fail`);  
    } 

    const convertNow = data[99];
    
    Petya.createUser((err, data) => {
      if (err) {
        console.log(`Ошибка при создании пользователя`);  
      } else {
        console.log(`${Petya.username} создано`);  
        console.log(data);
  
        Petya.performLogin((err, data) => {
          if (err) {
            console.log(`Ошибка при авторизации пользователя`);    
          } else {
            console.log(`Пользователь авторизован`);  
  
            Petya.addMoney({currency: 'EUR', amount: 50000}, (err, data) => {
              if (err) {
                console.log(`Ошибка при добавлении денег в кошелек`);    
              } else {
                console.log(`Добавлено ${amount} ${currency}`);
                
                const convertAmount = 50000 * convertNow.EUR_NETCOIN;
                Petya.convertMoney({
                  fromCurrency: 'EUR',
                  targetCurrency: 'NETCOIN', 
                  targetAmount: convertAmount
                },
                (err, data) => {
                  if (err) {
                    console.log(`Ошибка конвертации`);  
                  } else {
                    console.log(`Конвертация успешна - EUR в ${convertAmount} Netcoins`);   
                    console.log(data); 

                    Vasya.createUser((err, data) => {
                      if (err) {
                        console.log(`Ошибка при создании пользователя`);    
                      } else {
                        console.log(`${Vasya.username} создано`);  

                        Petya.transferMoney({to: Vasya.username, amount: convertAmount}, (err, data) => {
                          if (err) {
                            console.log(`Ошибка перевода средств`);  
                          } else {
                            console.log(`Успешный перевод пользователю ${Vasya.username}`);  
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