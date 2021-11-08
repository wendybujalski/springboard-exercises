describe("Payments.js tests (with setup and tear-down)", function() {
    beforeEach(function () {
        billAmtInput.value = 10;
        tipAmtInput.value = 2; 
    });

    it('should create a new payment object on createCurPayment()', () => {
        expect(createCurPayment()).toEqual({billAmt: "10", tipAmt: "2", tipPercent: 20});
    });

    it('should not create an empty payment on createCurPayment()', () => {
        billAmtInput.value = "";
        tipAmtInput.value = "";
        expect(createCurPayment()).toEqual(undefined);
    });

    it('should not add a new payment with empty input fields on submitPaymentInfo()', () => {
        // empty bill
        billAmtInput.value = "";
        submitPaymentInfo();
        expect(Object.keys(allPayments).length).toEqual(0);

        //empty tip
        billAmtInput.value = 10;
        tipAmtInput.value = "";
        submitPaymentInfo();
        expect(Object.keys(allPayments).length).toEqual(0);
    });

    it('should clear the input form on submitPaymentInfo()', () => {
        submitPaymentInfo();

        expect(billAmtInput.value).toEqual("");
        expect(tipAmtInput.value).toEqual("");
    });

    it('should add a curPayment object to allPayments on submitPaymentInfo()', () => {
        submitPaymentInfo();

        expect(allPayments["payment1"].billAmt).toEqual('10');
        expect(allPayments["payment1"].tipAmt).toEqual('2');
        expect(allPayments["payment1"].tipPercent).toEqual(20);
    });

    it('should update the #paymentTable with the new payment info on appendPaymentTable()', () => {
        allPayments["payment1"] = createCurPayment();
        
        appendPaymentTable(allPayments["payment1"]);

        let paymentTableTdList = document.querySelectorAll("#paymentTable tbody tr td");

        expect(paymentTableTdList[0].innerText).toEqual("$10");
        expect(paymentTableTdList[1].innerText).toEqual("$2");
        expect(paymentTableTdList[2].innerText).toEqual("20%");
    });

    afterEach(function() {
        paymentTbody.innerHTML = "";
        serverTbody.innerHTML = "";
        allPayments = {};
        paymentId = 0;

        summaryTds[0].innerHTML = "";
        summaryTds[1].innerHTML = "";
        summaryTds[2].innerHTML = "";

        billAmtInput.value = '';
        tipAmtInput.value = '';
    });
  });
  