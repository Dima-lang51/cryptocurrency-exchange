var vm = new Vue({
  el: '#app',
  data: {
    name:'',
    currencyListFiltered : [],
    currencyListAll: [],
    convertfrom: "BTC",
    convertto:"ETH",
    converttoname: "Ethereum",
    finalamount: null,
    amount: null,
    minAmount: null,
    message: '',
    imgArrowUrlFrom: 'url(./images/Vector.svg) no-repeat center',
    displayListFrom: 'none',
    imgArrowUrlTo: 'url(./images/Vector.svg) no-repeat center',
    displayListTo: 'none'
  },

  computed :{
    computedArrowImgUrlFrom: function () {
      return this.imgArrowUrlFrom;
    },
    computedDisplayListFrom: function () {
      return this.displayListFrom;
    },
    computedArrowImgUrlTo: function () {
      return this.imgArrowUrlTo;
    },
    computedDisplayListTo: function () {
      return this.displayListTo;
    }
  },
  watch: {
    amount: function(val) {
      this.message = '';
      if (val < this.minAmount) {
        this.finalamount = '-';
        this.message = 'Amount less then minimal amount';
      } else if (this.convertfrom == this.convertto) {
        this.message = 'This pair is disabled now'
        this.finalamount = '-';
      } else {
          this.fetchResourceFinal(val);
      }
    },
    convertfrom: function(val) {
      
      val = val.toLowerCase();
      console.log(val);
      this.currencyListFiltered = this.filterCurrency(val);
      let currencyinfo = this.checkCurrency(val);
      if (currencyinfo.length != 0) {
        this.message = '';
        this.fetchResource(val, this.convertto.toLowerCase());
      }
    },
    convertto: function(val) {
      val = val.toLowerCase();
      this.currencyListFiltered = this.filterCurrency(val);
      let currencyinfo = this.checkCurrency(val);
      if (currencyinfo.length != 0) {
        this.converttoname = currencyinfo[0].name
        this.message = '';
        this.fetchResource(this.convertfrom.toLowerCase(), val);
      }
    }
    },
    created() {
      this.fetchResourceCurrencies();
    },
    mounted() {
      this.fetchResource(this.convertfrom.toLowerCase(), this.convertto.toLowerCase())
    },
    
  methods: {
    openListFrom: function (event){
      console.log(event);
      if (this.displayListFrom == 'none') {
        this.imgArrowUrlFrom = 'url(./images/close.svg) no-repeat center';
        this.displayListFrom = 'block';
        this.currencyListFiltered = this.filterCurrency(this.convertfrom.toLowerCase());
      } else { //close list
        this.imgArrowUrlFrom = 'url(./images/Vector.svg) no-repeat center';
        this.displayListFrom = 'none';
        //this.currencyListFiltered = this.currencyListAll;
      } 
      
    },

    openListTo: function (event){
      if (this.displayListTo == 'none') {
        this.imgArrowUrlTo = 'url(./images/close.svg) no-repeat center';
        this.displayListTo = 'block';
        this.currencyListFiltered = this.filterCurrency(this.convertto.toLowerCase());
      } else { //close list
        this.imgArrowUrlTo = 'url(./images/Vector.svg) no-repeat center';
        this.displayListTo = 'none';
        //this.currencyListFiltered = this.currencyListAll;
      } 
    },
    filterCurrency(val){
      console.log(val);
      return this.currencyListAll.filter(function(currency) {
        //console.log(currency);

          return currency.ticker.includes(val);
      })
    },
    checkCurrency(val){
      return this.currencyListFiltered.filter(function(currency) {
          return currency.ticker == val;
      })
    },
    revers() {
      let revert;
      revert = this.convertfrom; 
      this.convertfrom = this.convertto; 
      this.convertto = revert;
    } ,
    async fetchResource(from, to) { 
      if (from === to) {
        this.amount = 0;
        this.minAmount = 0;
        this.message = 'Выберите разные валюты'
        return;
      }
      const response = await fetch('https://api.changenow.io/v1/min-amount/' + from + '_' + to + '?api_key=c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd')
      const json = await response.json()

      this.amount = json.minAmount;
      this.minAmount = json.minAmount;
      
      if (json.minAmount == null) {
         this.amount = 0;
         this.minAmount = 0;
         this.message = 'this pair is disabled now';
        console.log('this pair is disabled now');
        return;
      }
    },
    async fetchResourceFinal(val) {
      const response = await fetch('https://api.changenow.io/v1/exchange-amount/' + val + '/' + this.convertfrom + '_' + this.convertto + '?api_key=c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd')
      const json = await response.json()

      if (json.estimatedAmount == null) {
        this.finalamount = '-';
        console.log('this pair is disabled now');
        this.message = 'this pair is disabled now';
        return;
      }
      this.finalamount = json.estimatedAmount;
      //return json.estimatedAmount;
    },
    async fetchResourceCurrencies() {
      const response = await fetch('https://api.changenow.io/v1/currencies?active=true')
      const json = await response.json()

      //console.log( JSON.stringify(json));
      //let currencies =[];
      //json.forEach(element => {currencies.push({'ticker':element.ticker, 'name': element.name})})
      this.currencyListAll = json;
    }
  }
});