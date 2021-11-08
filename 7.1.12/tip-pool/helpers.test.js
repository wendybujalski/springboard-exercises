describe("Helpers.js tests (with setup and tear-down)", function() {
    beforeEach(function () {
        billAmtInput.value = 10;
        tipAmtInput.value = 2; 
        submitPaymentInfo();
    });
  
    it('should add up the total tip amount on sumPaymentTotal("tipAmt")', () => {
        expect(sumPaymentTotal("tipAmt")).toEqual(2);

        billAmtInput.value = 100;
        tipAmtInput.value = 20; 
        submitPaymentInfo();

        expect(sumPaymentTotal("tipAmt")).toEqual(22);
    });

    it('should add up the total bill amount on sumPaymentTotal("billAmt")', () => {
        expect(sumPaymentTotal("billAmt")).toEqual(10);

        billAmtInput.value = 100;
        tipAmtInput.value = 20; 
        submitPaymentInfo();

        expect(sumPaymentTotal("billAmt")).toEqual(110);
    });

    it('should add up the total tip percent amount on sumPaymentTotal("tipPercent")', () => {
        expect(sumPaymentTotal("tipPercent")).toEqual(20);
    });

    it('should properly calculate the tip percent of a submitted tip to calculateTipPercent(billAmt, tipAmt)', () => {
        expect(calculateTipPercent(100, 20)).toEqual(20);
        expect(calculateTipPercent(132, 44)).toEqual(33);
        expect(calculateTipPercent(50, 0)).toEqual(0);
    });

    it('should add a new td element with the given value as text to the given tr element on running appendTd(tr, value)', () => {
        let testTr = document.createElement('tr');

        appendTd(testTr, "testing");

        expect(testTr.children.length).toEqual(1);
        expect(testTr.children[0].innerText).toEqual("testing");
    });

    it('should add a delete button to given tr on appendDeleteBtn(tr)', () => {
        let testTr = document.createElement('tr');

        appendDeleteBtn(testTr);

        expect(testTr.children.length).toEqual(1);
        expect(testTr.children[0].innerText).toEqual("X");
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
  