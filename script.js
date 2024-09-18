document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const resultDiv = document.getElementById('result');
    const form = document.getElementById('currency-form');

    const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

    // Fetch currencies from API and populate selects
    async function fetchCurrencies() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            populateCurrencySelects(data.rates);
        } catch (error) {
            console.error('Error fetching currencies:', error);
            resultDiv.textContent = 'Error al obtener los datos de moneda.';
        }
    }

    // Populate the currency select elements
    function populateCurrencySelects(rates) {
        const currencyOptions = Object.keys(rates);

        // Ensure HNL (Honduran Lempira) is included
        if (!currencyOptions.includes('HNL')) {
            currencyOptions.push('HNL');
        }

        currencyOptions.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            fromCurrencySelect.appendChild(option.cloneNode(true));
            toCurrencySelect.appendChild(option);
        });

        // Set default values
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';
    }

    // Convert currency based on user input
    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || !fromCurrency || !toCurrency) {
            resultDiv.textContent = 'Por favor, ingrese una cantidad válida y seleccione las monedas.';
            return;
        }

        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const rates = data.rates;

            if (rates[fromCurrency] && rates[toCurrency]) {
                const result = (amount / rates[fromCurrency]) * rates[toCurrency];
                resultDiv.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
            } else {
                resultDiv.textContent = 'Moneda no soportada.';
            }
        } catch (error) {
            resultDiv.textContent = 'Error al realizar la conversión. Intente nuevamente.';
            console.error('Error in conversion:', error);
        }
    }

    // Event listener for form submission
    form.addEventListener('submit', event => {
        event.preventDefault();
        convertCurrency();
    });

    // Initial call to populate currency options
    fetchCurrencies();
});
