import {
  makeAxiosGetRequest,
  makeAxiosPostRequest,
  makeAxiosMultiPartRequest,
} from './wallet-api-service';

export const getAllSwipeluxOrders = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosGetRequest(temp + 'get_buy_crypto_orders', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getWalletSession = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'session_history',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getAllCoins = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'get_all_pairs',
      false,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getAllPairs = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'get_all_pairs_api',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getAllBalance = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'all_balance',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};
export const getCryptoBalance = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'crypto_all_balance',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const verificationPhoneCode = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'verification_phone_code', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const CheckPhoneOTP = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'check_phone_otp', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const resendPhoneCode = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'resendPhoneCode', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const Verifyemail = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'verifyEmail', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const CheckMailOTP = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'check_mail_otp', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const Createpreparedorder = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'create_prepared_order', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const saveKYC = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosMultiPartRequest(
      process.env.REACT_APP_WALLETBASEURL + 'save_kyc_details',
      true,
      params,
      true
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getKYCDetails = () => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'get_kyc_details',
      true
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getReceived = () => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'get_user_completed_deposit',
      true
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getUserAddress = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'get_user_address',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getUserCryptoAddress = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'get_user_crypto_address',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getAdminBankDetails = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'get_admin_bankdetails',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const fiatDeposit = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'fiat_deposit',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const externalTransfer = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'transferAmount',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const PayMarketplaceAmount = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'PayMarketplaceAmount',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const internalTransfer = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/lending/');
    makeAxiosPostRequest(temp + 'transferAmount', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const withdrawRequest = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'user_withdraw', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getEstimatedRates = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'get_estimated_rates', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getCurrenciesList = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosGetRequest(temp + 'get_currency_list_swipe', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const PayCreditCard = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'pay_credit_card', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const PaymentRequest = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'user_payment', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getUserWithdrawals = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    makeAxiosGetRequest(temp + 'get_user_withdraw', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const checkWithdrawal = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'check_withdraw', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getSentTransactions = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    makeAxiosGetRequest(temp + 'transferhistory', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getReceivedTransactions = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    makeAxiosGetRequest(temp + 'get_user_completed_deposit', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getUserDetails = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    makeAxiosGetRequest(temp + 'user_details', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};
export const getBalanceConverstion = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    makeAxiosGetRequest(temp + 'get_balance_converstion', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const getPairDetails = () => {
  return new Promise((resolve, reject) => {
    // var temp = process.env.REACT_APP_WALLETBASEURL;
    // temp = temp.replace("\/user\/", "/trade/");
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'get_pair_details',
      true
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const currentMarketPrice = (params) => {
  return new Promise((resolve, reject) => {
    // var temp = process.env.REACT_APP_WALLETBASEURL;
    // temp = temp.replace("\/user\/", "/trade/");
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'market_price',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getTradeDetails = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'trade_history',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const createOrder = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'createNewOrder',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
    // makeAxiosPostRequest(process.env.REACT_APP_WALLETBASEURL + "createOrders", true, params)
    //     .then(res => {
    //         resolve(res.data);
    //     })
    //     .catch(e => {
    //         reject(e.response);
    //     });
  });
};

export const cancelOrder = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/trade/');
    makeAxiosPostRequest(temp + 'cancelOrder_api', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const gigHandshake = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'gigs-transfer-amount',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const productAddToCart = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'product-add-to-cart',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const productReport = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'productReport',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const productCartCompleted = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'product-cart-completed',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const gigRelease = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'gigs-transfer-completed',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const updateTFA = (params) => {
  return new Promise((resolve, reject) => {
    // var temp = process.env.REACT_APP_WALLETBASEURL;
    // temp = temp.replace("\/user\/", "/trade/");
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'updateTfa',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const updateWithdrawPassword = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'userWithdrawpassword', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const whitelistAddress = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'whithdraw_whitlisting', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const confirmCancelWhitelist = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'confirm_cancel_address', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const deleteWhitelist = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'delete_whithdraw_whitlisting', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getWithdrawAddresses = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/withdraw/');
    makeAxiosPostRequest(temp + 'get_whithdraw_whitlisting', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getTradePairs = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/trade/');
    makeAxiosGetRequest(temp + 'pair_details', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const gertRewardPoints = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'gertRewardPoints',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getUserFav = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/trade/');
    makeAxiosGetRequest(temp + 'get_user_fav', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const updateUserFav = (params) => {
  return new Promise((resolve, reject) => {
    var temp = process.env.REACT_APP_WALLETBASEURL;
    temp = temp.replace('/user/', '/trade/');
    makeAxiosPostRequest(temp + 'update_user_fav', true, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getActiveOrders = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'active_oprders',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const updateRewardFeeSettings = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'feeStatusUpdate',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const getRewardFeeSettings = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'getRewardDetails',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const externalepayTransfer = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETEPAYURL + 'transferAmount',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
};

export const createReport = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosPostRequest(
      process.env.REACT_APP_WALLETBASEURL + 'report',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};

export const removeReport = (params) => {
  return new Promise((resolve, reject) => {
    makeAxiosGetRequest(
      process.env.REACT_APP_WALLETBASEURL + 'reportRemove',
      true,
      params
    )
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e.response);
      });
  });
};
