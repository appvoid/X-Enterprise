package com.nohakcoffeeofficial.xenterprisekotlin

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.google.firebase.firestore.FirebaseFirestore
import com.nohakcoffeeofficial.xenterprisekotlin.databinding.ActivityMainBinding

const val TAG = "FIRESTORE"

class MainActivity : AppCompatActivity() {

    // Activity binding makes possible to use functionality easier
    private var binding : ActivityMainBinding? = null

    // Database connection
    val fireStoreDatabase = FirebaseFirestore.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        // Main setup
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding?.root)

        // Calling a custom model
        fireStoreDatabase.collection("users")
            .get()
            .addOnCompleteListener{
                val result: StringBuffer = StringBuffer()
                if (it.isSuccessful) {
                    for (document in it.result!!)
                        result.append(document.data.getValue("firstName")).append(" ")
                              .append(document.data.getValue("lastName")).append("\n")
                }
                binding?.userDataTest?.text = result
            }
    }
}