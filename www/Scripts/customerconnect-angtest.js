var CustomerConnect = {
    // Public - Configuration
    Config: {
        AccountKey: null,
        SessionId: null,
        CustomerName: null,
        URL: null,
        Settings: null
    },

    // Request Functions and Objects
    Request: {

        //Private - Create Request and return data into deferred object.
        CreateRequest: function ($q, requestType, body) {
            var deferred = $q.defer();


            var rq = '{"RequestType":"' + requestType + '","AccountKey":"' + CustomerConnect.Config.AccountKey + '","SessionID":"' + CustomerConnect.Config.SessionId + '","Body":"' + CustomerConnect.Util.base64._encode(JSON.stringify(body)) + '","UserAgent":"' + navigator.userAgent.toString() + '"}';

            $http.post(CustomerConnect.Config.URL, {rq}).then(function ($q, data) {
                if (requestType == 'Login' && !data.Failed) {
                    CustomerConnect.Config.SessionId = data.ReturnObject.SessionID;
                    CustomerConnect.Config.CustomerName = data.ReturnObject.CustomerName;
                }
                if (requestType == 'Logoff' && !data.Failed) {
                    CustomerConnect.Config.SessionId = null;
                    CustomerConnect.Config.CustomerName = null;
                }

                if (!data.Failed) {
                    deferred.resolve(data);
                } else {
                    deferred.reject(data);
                }
            });

            return deferred.promise;
        }

    },

    // AR Functions and Objects
    AR: {
        //Private - ARStatement ID
        ARStatement: function (statementId) {
            this.statementId = statementId;
        },

        //Private - ARPayment for Insert
        ARPayment: function ($q, cardOnFileId, cardNo, cardExp, addCardToAccount, amount) {
            this.cardOnFileId = cardOnFileId;
            this.cardNo = cardNo;
            this.cardExp = cardExp;
            this.addCardToAccount = addCardToAccount;
            this.amount = amount;
        },

        //Public - Retrieve current AR Balance
        GetARBalance: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'ARBalance', null);
        },

        //Public - Retrieve current AR activity
        GetARCurrentActivity: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'ARCurrentActivity', null);
        },

        //Public - Retrieve detailed list of payments.
        GetPaymentDetails: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'ARPaymentsDetail', null);
        },

        //Public - Retrieve information about a single statement.
        GetStatementDetails: function (statementId) {
            return new CustomerConnect.Request.CreateRequest($q, 'ARStatementDetail', new this.ARStatement(statementId));
        },

        //Public - Retrieve list of statements with summary information
        GetStatementsList: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'ARStatementsList', null);
        },

        SavePayment: function ($q, cardOnFileId, cardNo, cardExp, addCardToAccount, amount) {
            return new CustomerConnect.Request.CreateRequest($q, 'SavePayment', new this.ARPayment(cardOnFileId, cardNo, cardExp, addCardToAccount, amount));
        }
    },

    // Customer functions and objects
    Customer: {
        AddressObject: function ($q, address1, address2, city, state, zip) {
            this.address1 = address1;
            this.address2 = address2;
            this.city = city;
            this.state = state;
            this.zip = zip;
        },

        Award: function ($q, awardId) {
            this.id = awardId;
        },

        //Private - Save customer object
        CustomerInfo: function ($q, clientAccountID, firstName, lastName, emailAddress, serviceType, password, accountNodeID, title, statementDestination, comments, referralSource, birthDate, routeID, clientInfo, primaryAddress1, primaryAddress2, primaryAddressCity, primaryAddressState, primaryAddressZip, deliveryAddress1, deliveryAddress2, deliveryAddressCity, deliveryAddressState, deliveryAddressZip, billingAddress1, billingAddress2, billingAddressCity, billingAddressState, billingAddressZip) {
            this.clientAccountID = clientAccountID;
            this.firstName = firstName;
            this.lastName = lastName;
            this.emailAddress = emailAddress;
            this.serviceType = serviceType;
            this.password = password;
            this.accountNodeID = accountNodeID;
            this.title = title;
            this.statementDestination = statementDestination;
            this.comments = comments;
            this.referralSource = referralSource;
            this.birthDate = birthDate;
            this.routeID = routeID;
            this.clientInfo = clientInfo;
            this.primaryAddress = { Address1: primaryAddress1, Address2: primaryAddress2, City: primaryAddressCity, State: primaryAddressState, Zip: primaryAddressZip };
            this.deliveryAddress = { Address1: deliveryAddress1, Address2: deliveryAddress2, City: deliveryAddressCity, State: deliveryAddressState, Zip: deliveryAddressZip };
            this.billingAddress = { Address1: billingAddress1, Address2: billingAddress2, City: billingAddressCity, State: billingAddressState, Zip: billingAddressZip };
        },

        // Private GiftCard Object
        GiftCardNumber: function ($q, giftCardNumber) {
            this.number = giftCardNumber;
        },

        // Private Notification Object
        Notification: function ($q, notificationTypeName, notificationMethodName, notificationValue) {
            this.notificationTypeName = notificationTypeName;
            this.notificationMethodName = notificationMethodName;
            this.notificationValue = notificationValue;
        },

        ConvertToDelivery: function ($q, routeId) {
            return new CustomerConnect.Request.CreateRequest($q, 'ConvertToDelivery', routeId);
        },

        // Public - Get Customer Info
        GetCustomer: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'CustomerDetail', null);
        },

        // Public - Apply Award Code
        IssueAward: function ($q, awardId) {
            return new CustomerConnect.Request.CreateRequest($q, 'IssueAward', new this.Award(awardId));
        },

        // Public - Send Notification of Pickup to Store
        NotifyPickup: function (storeId, timeRequested) {
            return new CustomerConnect.Request.CreateRequest($q, 'NotifyPickup', new this.PickupNotification(storeId, timeRequested));
        },

        // Private - Notify Pickup Object
        PickupNotification: function (storeId, timeRequested) {
            this.storeId = SPAccountNodeID;
            this.timeRequested = TimeRequested;
        },

        // Public - Redeem Gift Card
        RedeemGiftCard: function ($q, giftCardNumber) {
            return new CustomerConnect.Request.CreateRequest($q, 'GiftCardRedeem', new this.GiftCardNumber(giftCardNumber));
        },

        // Public - Retrieve Gift Card Balance
        RetrieveGiftCardBalance: function ($q, giftCardNumber) {
            return new CustomerConnect.Request.CreateRequest($q, 'GiftCardBalance', new this.GiftCardNumber(giftCardNumber));
        },

        // Public - Retrieve Gift Cards
        RetrieveGiftCards: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'RetrieveGiftCards', null);
        },

        // Public - Save Customer Info
        SaveCustomer: function ($q, clientInfo) {
            if (clientInfo.clientAccountID === '') {
                return new CustomerConnect.Request.CreateRequest($q, 'Signup', clientInfo);
            }
            else {
                return new CustomerConnect.Request.CreateRequest($q, 'SaveCustomer', clientInfo);
            }
        },

        // Public - Unsubscribe / Enable
        SaveNotification: function ($q, notifications) {
            return new CustomerConnect.Request.CreateRequest($q, 'Unsubscribe', notifications);
        },

        // Public - Unsubscribe / Enable
        SaveNotificationNoUser: function ($q, notifications) {
            return new CustomerConnect.Request.CreateRequest($q, 'UnsubscribeNoUser', notifications);
        },

        // Public - Unsubscribe All / Enable All
        SaveNotificationAll: function ($q, notification) {
            return new CustomerConnect.Request.CreateRequest($q, 'UnsubscribeAll', notification);
        },

        // Public - Unsubscribe All / Enable All
        SaveNotificationAllNoUser: function ($q, notification) {
            return new CustomerConnect.Request.CreateRequest($q, 'UnsubscribeAllNoUser', notification);
        },
        SendEmail: function ($q, email) {
            return new CustomerConnect.Request.CreateRequest($q, 'SendEmail', email);
        }
    },

    //Invoice Functions and Objects
    Invoice: {
        //Private - InvoiceID
        Invoice: function ($q, invoiceId) {
            this.invoiceId = invoiceId;
        },

        InvoicesList: function ($q, filterTypeId, startDate, endDate) {
            this.filterTypeId = filterTypeId;
            this.startDate = startDate;
            this.endDate = endDate;
        },

        InvoicesListGarment: function ($q, garmentDesc, descriptor) {
            this.garmentDesc = garmentDesc;
            this.descriptor = descriptor;
        },

        //Public - Retrieve Invoice Info
        GetInvoiceDetails: function ($q, invoiceId) {
            return new CustomerConnect.Request.CreateRequest($q, 'InvoiceDetail', new this.Invoice(invoiceId));
        },

        GetInvoiceList: function ($q, filterTypeId, startDate, endDate) {
            return new CustomerConnect.Request.CreateRequest($q, 'InvoicesList', new this.InvoicesList(filterTypeId, startDate, endDate));
        },

        GetInvoiceListGarment: function ($q, garmentDesc, descriptor) {
            return new CustomerConnect.Request.CreateRequest($q, 'InvoicesByGarment', new this.InvoicesListGarment(garmentDesc, descriptor));
        }
    },

    // Route Pickup/Cancellation Functions and Objects
    Route: {
        CancellationRequest: function ($q, fromDate, toDate, comments, instructionsRequest) {
            this.fromDate = fromDate;
            this.toDate = toDate;
            this.comments = comments;
            this.instructionsRequest = instructionsRequest;
        },

        PickupRequest: function ($q, accountTransactionNumber, pickupDate, comments, instructionsRequest, deliveryType, visitType, deliveryDate) {
            this.accountTransactionNumber = accountTransactionNumber;
            this.comments = comments;
            this.instructionsRequest = instructionsRequest;
            this.deliveryType = deliveryType;
            this.pickupDate = pickupDate;
            this.visitType = visitType;
            this.deliveryDate = deliveryDate;
        },

        GetRouteDeliveryZones: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'GetDeliveryZones', null);
        },

        PendingCancellations: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'PendingCancellations', null);
        },

        PendingPickups: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'PendingPickups', null);
        },

        SaveCancellationRequest: function ($q, cancellationRequest) {
            return new CustomerConnect.Request.CreateRequest($q, 'CancellationRequest', cancellationRequest);
        },

        SavePickupRequest: function ($q, pickupRequest) {
            return new CustomerConnect.Request.CreateRequest($q, 'PickupRequest', pickupRequest);
        }
    },

    // Settings
    Settings: {
        JSONBlob: function ($q, instanceId, name, json) {
            this.instanceId = instanceId;
            this.name = name;
            this.json = json;
        },

        GetNotifications: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'GetNotifications', null);
        },

        GetPreferences: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'GetPreferences', null);
        },

        GetSettings: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'GetSettings', null);
        },

        StoreJSON: function ($q, name, json) {
            return new CustomerConnect.Request.CreateRequest($q, 'StoreJSON', { name: name, json: json});
        },

        RetrieveJSON: function ($q, name) {
            return new CustomerConnect.Request.CreateRequest($q, 'RetrieveJSON', { name: name });
        },

        ValidateCaptcha: function ($q, response) {
            return new CustomerConnect.Request.CreateRequest($q, 'ValidateCaptcha', { response: response });
        }
    },

    // Store functions and objects
    Store: {
        GetStoreList: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'StoreList', null);
        }
    },

    //User Functions and Objects
    User: {

        // Private - Message To Manager object.
        MessageToManager: function (subject, message, invoiceid) {
            this.subject = subject;
            this.message = message;
            this.invoiceid = invoiceid;
        },

        // Public - Change Password for logged in user.
        ChangePassword: function ($q, newPassword) {
            return new CustomerConnect.Request.CreateRequest($q, 'ChangePassword', newPassword);
        },

        // Public - Send Message To Manager
        SendMessage: function (subject, body, invoiceid) {
            return new CustomerConnect.Request.CreateRequest($q, 'MessageToManagerNoUser', new this.MessageToManager(subject, body, null));
        },

        // Public - Send Message To Manager
        SendMessageUser: function (subject, body, invoiceid) {
            return new CustomerConnect.Request.CreateRequest($q, 'MessageToManagerUser', new this.MessageToManager(subject, body, invoiceid));
        },

        // Private - Login Object
        LoginObject: function ($q, emailAddress, password) {
            this.user = emailAddress;
            this.password = password;
        },

        // Public - Initiate Login
        Login: function ($q, emailAddress, password) {
            return new CustomerConnect.Request.CreateRequest($q, 'Login', new this.LoginObject(emailAddress, password));
        },

        // Public  - Intiate Logout Request
        Logout: function ($q) {
            return new CustomerConnect.Request.CreateRequest($q, 'Logoff', null);
        },

        // Public - Request password reminder
        PasswordReminder: function ($q, requestInfo) {
            return new CustomerConnect.Request.CreateRequest($q, 'RememberPasswordRequest', requestInfo);
        },

        // Public - Request password reminder
        FinishPasswordReminder: function ($q, requestInfo) {
            return new CustomerConnect.Request.CreateRequest($q, 'RememberPasswordFinish', requestInfo);
        },

        // Private - Insert Event Object
        InsertEventRequest: function ($q, productName, customerID, eventStartDateTime, eventSource, eventEndDateTime) {
            this.productName = productName;
            this.customerID = customerID;
            this.eventStartDateTime = eventStartDateTime;
            this.eventSource = eventSource;
            this.eventEndDateTime = eventEndDateTime;
        },

        // Public - Insert a tracking event
        InsertEvent: function ($q, requestInfo) {
            return new CustomerConnect.Request.CreateRequest($q, 'InsertEvent', requestInfo);
        },

        // Public - Update Event Object
        UpdateEventRequest: function ($q, instanceID, customerID, eventEndDateTime) {
            this.instanceID = instanceID;
            this.customerID = customerID;
            this.eventEndDateTime = eventEndDateTime;
        },

        // Public - Update a tracking event
        UpdateEvent: function ($q, requestInfo) {
            return new CustomerConnect.Request.CreateRequest($q, 'UpdateEvent', requestInfo);
        }
    },

    // Util functions
    Util: {
        // Private - Encode Base64.
        base64: {
            _PADCHAR: "=",
            _ALPHA: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            _VERSION: "1.0",

            _getbyte64: function (s, i) {
                var idx = this._ALPHA.indexOf(s.charAt(i));
                if (idx === -1) {
                    throw "Cannot decode base64";
                }
                return idx;
            },

            _decode: function (s) {
                var pads = 0, i, b10,
                    imax = s.length,
                    x = [];
                s = String(s);
                if (imax === 0) {
                    return s;
                }
                if (imax % 4 !== 0) {
                    throw "Cannot decode base64";
                }
                if (s.charAt(imax - 1) === this._PADCHAR) {
                    pads = 1;
                    if (s.charAt(imax - 2) === this._PADCHAR) {
                        pads = 2;
                    }
                    imax -= 4;
                }
                for (i = 0; i < imax; i += 4) {
                    b10 = (this._getbyte64(s, i) << 18) | (this._getbyte64(s, i + 1) << 12) | (this._getbyte64(s, i + 2) << 6) | this._getbyte64(s, i + 3);
                    x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255));
                }
                switch (pads) {
                    case 1: b10 = (this._getbyte64(s, i) << 18) | (this._getbyte64(s, i + 1) << 12) | (this._getbyte64(s, i + 2) << 6); x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255)); break;
                    case 2: b10 = (this._getbyte64(s, i) << 18) | (this._getbyte64(s, i + 1) << 12); x.push(String.fromCharCode(b10 >> 16)); break;
                }
                return x.join("");
            },

            _getbyte: function (s, i) {
                var x = s.charCodeAt(i);
                if (x > 255) {
                    throw "INVALID_CHARACTER_ERR: DOM Exception 5";
                }
                return x;
            },

            _encode: function (s) {
                if (arguments.length !== 1) {
                    throw "SyntaxError: exactly one argument required";
                }
                s = String(s);
                var i, b10, x = [], imax = s.length - s.length % 3;
                if (s.length === 0) {
                    return s;
                }
                for (i = 0; i < imax; i += 3) {
                    b10 = (this._getbyte(s, i) << 16) | (this._getbyte(s, i + 1) << 8) | this._getbyte(s, i + 2);
                    x.push(this._ALPHA.charAt(b10 >> 18));
                    x.push(this._ALPHA.charAt((b10 >> 12) & 63));
                    x.push(this._ALPHA.charAt((b10 >> 6) & 63));
                    x.push(this._ALPHA.charAt(b10 & 63));
                }
                switch (s.length - imax) {
                    case 1: b10 = this._getbyte(s, i) << 16; x.push(this._ALPHA.charAt(b10 >> 18) + this._ALPHA.charAt((b10 >> 12) & 63) + this._PADCHAR + this._PADCHAR); break;
                    case 2: b10 = (this._getbyte(s, i) << 16) | (this._getbyte(s, i + 1) << 8); x.push(this._ALPHA.charAt(b10 >> 18) + this._ALPHA.charAt((b10 >> 12) & 63) + this._ALPHA.charAt((b10 >> 6) & 63) + this._PADCHAR); break;
                }
                return x.join("");
            }
        },

        Validate: {
            CCExpiration: function (s) {
                if (/^[0-9]{2}[//][0-9]{2}$/.test(s)) {
                    if (new Date().getFullYear() < Number(s.split('/')[1]) + 2000) {
                        return true;
                    }
                }
                return false;
            },

            CCNumber: function (s) {
                var ca, sum = 0, mul = 1;
                var len = s.length;
                while (len--) {
                    ca = parseInt(s.charAt(len), 10) * mul;
                    sum += ca - (ca > 9) * 9;
                    mul ^= 3;
                }
                return (sum % 10 === 0) && (sum > 0);
            },

            CCType: function (s) {
                if (typeof CustomerConnect.Config.Settings.CCTypesSupported == 'undefined') {
                    return false;
                }

                if (CustomerConnect.Config.Settings.CCTypesSupported.search(CustomerConnect.Util.Validate.GetCCType(s)) == -1) {
                    return false;
                }

                return CustomerConnect.Util.Validate.CCNumber(s);
            },

            EmailAddress: function (s) {
                return /^[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]{2,4}/.test(s);
            },

            GetCCType: function (s) {
                var cc = (s + '').replace(/\s/g, ''); //remove space

                if ((/^(34|37)/).test(cc) && cc.length == 15) {
                    return 'AMEX'; //AMEX begins with 34 or 37, and length is 15.
                } else if ((/^(51|52|53|54|55)/).test(cc) && cc.length == 16) {
                    return 'MC'; //MasterCard beigins with 51-55, and length is 16.
                } else if ((/^(4)/).test(cc) && (cc.length == 13 || cc.length == 16)) {
                    return 'VISA'; //VISA begins with 4, and length is 13 or 16.
                } else if ((/^(300|301|302|303|304|305|36|38)/).test(cc) && cc.length == 14) {
                    return 'DNRS'; //Diners Club begins with 300-305 or 36 or 38, and length is 14.
                } else if ((/^(6011)/).test(cc) && cc.length == 16) {
                    return 'DISC'; //Discover begins with 6011, and length is 16.
                } else if ((/^(3)/).test(cc) && cc.length == 16) {
                    return 'JCB';  //JCB begins with 3, and length is 16.
                } else if ((/^(2131|1800)/).test(cc) && cc.length == 15) {
                    return 'JCB';  //JCB begins with 2131 or 1800, and length is 15.
                } else if ((/^(300|301|302|303|304|305|36|38)/).test(cc) && cc.length == 14) {
                    return 'CART'; //Cart Blanche begins with 300-305 or 36 or 38 and length of 14.
                } else if ((/^(6334|6767)/).test(cc) && (cc.length == 16 || cc.length == 18 || cc.length == 19)) {
                    return 'SOLO'; //Solo begins with 6334 or 6767 and length is 16, 18, or 19.
                } else if ((/^(4903|4905|4911|4936|564182|633110|633|6759)/).test(cc) && (cc.length == 16 || cc.length == 18 || cc.length == 19)) {
                    return 'SWTC'; //Switch begins with 4903, 4905, 4911, 4936, 564182, 633110, 6333, 6759 and length is 16, 18, or 19.
                } else if ((/^(5020|6)/).test(cc) && (cc.length == 16 || cc.length == 18)) {
                    return 'MAES'; //Maestro begins with 5020 or 6 and length is 16 or 18.
                }
                return 'UNKN'; //unknown type
            },

            Password: function (s) {
                if (!/^.{6,30}$/.test(s) || !/[A-Z]/.test(s) || !/[0-9]/.test(s)) {
                    return false;
                } else {
                    return true;
                }
            },

            Phone10: function (s) {
                var p = (s + '').replace(/[^\d]/g, '');
                return /^[\d]{10}$/.test(p);
            }
        }
    }
};