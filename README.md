# cryptocurrency-exchange

1. From the API, a list of all currencies is taken and a widget is created for all possible pairs;
2. In the widget, you can select the left and right currencies;
3. When choosing a currency, the minimum exchange amount is set in the left input;
4. When entered into the left input, the estimated value for the selected currencies and the amount in the left input are considered and substituted into the right input;
5. If the amount is less than the minimum, then a dash is written to the right input and an error is displayed;
6. If the API returns null for estimated or min for the selected currencies, the error "this pair is disabled now" will be thrown;
7. Search implemented;
8. From the API, only methods were used (excluding search tasks):
    1.1. List of available currencies;
    1.2. Minimal exchange amount;
    1.3. Estimated exchange amount.
9. Support - latest versions of major browsers;
10. The vue.js framework was used;
