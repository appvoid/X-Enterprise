package com.nohakcoffeeofficial.xenterprisekotlin
import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
// import android.util.Log
import android.view.View
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
// import com.google.firebase.firestore.FirebaseFirestore
import com.nohakcoffeeofficial.xenterprisekotlin.databinding.ActivityMainBinding
import java.util.*

// Debugging tag
const val TAG = "TAG"

@Suppress("DEPRECATION")
class MainActivity : AppCompatActivity() {
    // Activity binding makes possible to use functionality easier
    private var app : ActivityMainBinding? = null

    // Class to reference webview object context and methods
    class WebAppInterface internal constructor(c: Context) {
        var mContext: Context

        /** Instantiate the interface and set the context  */
        init {
            mContext = c
        }

        @JavascriptInterface
        fun sayHello(msg: String?) {

        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        // Main setup
        super.onCreate(savedInstanceState)
        // Bind the keyword 'app' to the layout
        app = ActivityMainBinding.inflate(layoutInflater)


        // Webview code
        val webview = app?.webview as WebView
        webview.addJavascriptInterface(WebAppInterface(this), "Android") //Webview keyword access
        webview.loadUrl("file:///android_asset/web/index.html")

        val webSettings = webview.settings
        webSettings.javaScriptEnabled = true

        // Fullscreen setup
        val decorView: View = window.decorView
        Objects.requireNonNull(supportActionBar)?.hide();
        decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN;
        window.addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(app?.root)
    }
}