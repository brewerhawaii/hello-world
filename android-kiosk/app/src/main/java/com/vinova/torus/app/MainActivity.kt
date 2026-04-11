package com.vinova.torus.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.vinova.torus.features.session.SessionTimeoutManager
import com.vinova.torus.features.session.TorusNavHost

class MainActivity : ComponentActivity() {
  private val timeoutManager = SessionTimeoutManager()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
      val nav = rememberNavController()
      Surface(modifier = Modifier.fillMaxSize()) {
        TorusNavHost(navController = nav, timeoutManager = timeoutManager)
      }
    }
  }
}
