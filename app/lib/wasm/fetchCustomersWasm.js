// wasm.js
import { wasmBrowserInstantiate } from "./instantiateWasm";

const runWasmAdd = async () => {    
    // Load wasm_exec.js script dynamically on the client-side
    const script = document.createElement('script');
    script.src = '/wasm-exec.js';
    script.strategy="beforeInteractive";
    document.body.appendChild(script);

    // Define the function to run the WebAssembly module
    const runWasm = async () => {
        try {
            let customers;
            const go = new Go();
            const wasmModule = await wasmBrowserInstantiate("/fetchCustomers.wasm", go.importObject);
            go.run(wasmModule.instance);
            await fetchCustomers().then(data => {
                customers = data; // Handle the fetched customers data
            }).catch(error => {
                console.error('fetchCustomers: ', error); // Handle any errors
            });
            console.log('customers', customers)
            return customers;
        } catch (error) {
            console.log('WebAssembly module error:', error)
        }
        
    };

    // Run the WebAssembly module after wasm_exec.js is loaded
    return new Promise((resolve, reject) => {
        script.onload = async () => {
            const result = await runWasm();
            resolve(result);
        };
    });
};

export { runWasmAdd };
