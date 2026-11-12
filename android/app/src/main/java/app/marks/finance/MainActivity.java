package app.marks.finance;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.webkit.*;
import android.util.Base64;
import android.widget.Toast;
import java.io.*;

/** Local HTTPS WebView container. External sites always open outside the app. */
public final class MainActivity extends Activity {
 private WebView web;
 private ValueCallback<Uri[]> fileCallback;
 private byte[] exportBytes;
 private static final int PICK_FILE=71,SAVE_BACKUP=72;
 private static final String HOST="appassets.androidplatform.net";
 @Override public void onCreate(Bundle state){
  super.onCreate(state);
  web=new WebView(this);
  web.setOnApplyWindowInsetsListener((view,insets)->{view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets;});
  setContentView(web);
  if(android.os.Build.VERSION.SDK_INT>=33)getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,()->navigateBack());
  WebSettings settings=web.getSettings();
  settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);
  settings.setAllowFileAccess(false);settings.setAllowContentAccess(true);
  settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
  settings.setSupportMultipleWindows(true);settings.setJavaScriptCanOpenWindowsAutomatically(false);
  web.addJavascriptInterface(new BackupBridge(),"MarksFiles");
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
    Uri uri=request.getUrl();if(!HOST.equals(uri.getHost()))return null;
    String path=uri.getPath();
    if(path==null||!path.startsWith("/assets/")||path.contains(".."))return new WebResourceResponse("text/plain","UTF-8",null);
    String name=path.substring(8);String mime=name.endsWith(".json")?"application/json":name.endsWith(".png")?"image/png":"text/html";
    try{return new WebResourceResponse(mime,"UTF-8",getAssets().open(name));}catch(IOException error){return new WebResourceResponse("text/plain","UTF-8",null);}
   }
   @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){Uri uri=request.getUrl();if(HOST.equals(uri.getHost())&&"https".equals(uri.getScheme()))return false;openExternal(uri);return true;}
  });
  web.setWebChromeClient(new WebChromeClient(){
   @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
    if(fileCallback!=null)fileCallback.onReceiveValue(null);fileCallback=callback;
    try{startActivityForResult(params.createIntent(),PICK_FILE);}catch(Exception error){fileCallback.onReceiveValue(null);fileCallback=null;Toast.makeText(MainActivity.this,"Não foi possível abrir o seletor de arquivos.",Toast.LENGTH_LONG).show();}return true;
   }
   @Override public boolean onCreateWindow(WebView view,boolean dialog,boolean gesture,android.os.Message message){
    if(!gesture)return false;final WebView temporary=new WebView(MainActivity.this);
    temporary.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){openExternal(request.getUrl());temporary.destroy();return true;}});
    ((WebView.WebViewTransport)message.obj).setWebView(temporary);message.sendToTarget();return true;
   }
  });
  web.setDownloadListener((url,agent,disposition,mime,length)->{
   if(url.startsWith("blob:")){
    String script="fetch("+org.json.JSONObject.quote(url)+").then(r=>r.blob()).then(b=>{const reader=new FileReader();reader.onload=()=>MarksFiles.saveBackup(String(reader.result).split(',')[1]);reader.readAsDataURL(b);})";
    web.evaluateJavascript(script,null);
   }else if(url.startsWith("https:"))openExternal(Uri.parse(url));
  });
  if(state!=null)web.restoreState(state);else web.loadUrl("https://"+HOST+"/assets/index.html");
 }
 private void openExternal(Uri uri){String scheme=uri.getScheme();if(!"https".equals(scheme)&&!"http".equals(scheme)&&!"mailto".equals(scheme))return;try{startActivity(new Intent(Intent.ACTION_VIEW,uri));}catch(Exception error){Toast.makeText(this,"Não há aplicativo para abrir este link.",Toast.LENGTH_SHORT).show();}}
 public final class BackupBridge {
  @JavascriptInterface public void saveBackup(String encoded){
   if(encoded.length()>32*1024*1024)return;
   try{final byte[] bytes=Base64.decode(encoded,Base64.DEFAULT);runOnUiThread(()->{if(exportBytes!=null)return;exportBytes=bytes;Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);intent.setType("application/json");intent.addCategory(Intent.CATEGORY_OPENABLE);intent.putExtra(Intent.EXTRA_TITLE,"Marks-backup.json");try{startActivityForResult(intent,SAVE_BACKUP);}catch(Exception error){exportBytes=null;Toast.makeText(MainActivity.this,"Não foi possível exportar o backup.",Toast.LENGTH_LONG).show();}});}catch(IllegalArgumentException ignored){}
  }
 }
 @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);
  if(request==PICK_FILE&&fileCallback!=null){fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result,data));fileCallback=null;}
  if(request==SAVE_BACKUP){if(result==RESULT_OK&&data!=null&&data.getData()!=null&&exportBytes!=null){try(OutputStream output=getContentResolver().openOutputStream(data.getData())){if(output==null)throw new IOException();output.write(exportBytes);Toast.makeText(this,"Backup exportado.",Toast.LENGTH_SHORT).show();}catch(IOException error){Toast.makeText(this,"Falha ao salvar o backup.",Toast.LENGTH_LONG).show();}}exportBytes=null;}
 }
 @Override public void onBackPressed(){navigateBack();}
 private void navigateBack(){web.evaluateJavascript("(()=>{const menu=document.querySelector('.menu-scrim');if(menu){menu.click();return true;}const close=document.querySelector('.modal [aria-label=\"Fechar\"]');const back=document.querySelector('.screen-back-button');if(close){close.click();return true;}if(back){back.click();return true;}return false;})()",value->{if(!"true".equals(value))finish();});}
 @Override protected void onSaveInstanceState(Bundle state){super.onSaveInstanceState(state);web.saveState(state);}
 @Override protected void onPause(){if(web!=null)web.onPause();super.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
 @Override protected void onDestroy(){if(fileCallback!=null)fileCallback.onReceiveValue(null);web.removeJavascriptInterface("MarksFiles");web.destroy();super.onDestroy();}
}
