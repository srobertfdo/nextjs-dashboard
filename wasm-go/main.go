package main

import (
	"encoding/json"
	"fmt"
	"syscall/js"
)

type Customer struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	ImageURL string `json:"image_url"`
}

// fetchCustomers fetches the customers.json file using JavaScript's Fetch API and returns the customer list.
func fetchCustomers(this js.Value, args []js.Value) interface{} {
	promise := js.Global().Get("Promise").New(js.FuncOf(func(this js.Value, arguments []js.Value) interface{} {
		resolve := arguments[0]
		reject := arguments[1]

		// Use JavaScript's fetch API to get the customers.json file.
		js.Global().Call("fetch", "/customers.json").Call("then", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			response := args[0]
			return response.Call("json")
		})).Call("then", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			jsonData := args[0]
			// Convert the JSON data to Go struct
			var customers struct {
				Customers []Customer `json:"customers"`
			}
			customersData := js.Global().Get("JSON").Call("stringify", jsonData).String()
			if err := json.Unmarshal([]byte(customersData), &customers); err != nil {
				fmt.Println("Error unmarshalling JSON:", err)
				reject.Invoke("Error unmarshalling JSON")
				return nil
			}

			// Marshal the Go struct to JSON for passing to JavaScript
			customersJSON, err := json.Marshal(customers.Customers)
			if err != nil {
				fmt.Println("Error marshalling customers to JSON:", err)
				reject.Invoke("Error marshalling customers to JSON")
				return nil
			}

			// Resolve the promise with the JSON string parsed back to a JavaScript object
			resolve.Invoke(js.Global().Get("JSON").Call("parse", string(customersJSON)))
			return nil
		})).Call("catch", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			err := args[0]
			fmt.Println("Failed to fetch customers.json:", err)
			reject.Invoke("Failed to fetch customers.json")
			return nil
		}))

		return nil
	}))

	return promise
}

func registerCallbacks() {
	js.Global().Set("fetchCustomers", js.FuncOf(fetchCustomers))
}

func main() {
	c := make(chan struct{}, 0)

	registerCallbacks()

	<-c
}
