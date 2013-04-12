<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>Label</key>
        <string>ie.hood.local-tld-service</string>
        <key>ProgramArguments</key>
        <array>
                <string>{{ NODE_BIN }}</string>
                <string>{{ SERVICE_FILE }}</string>
        </array>
        <key>EnvironmentVariables</key>
        <dict>
                <key>LOCAL_TLD_CONF</key>
                <string>{{ CONFIG_FILE }}</string>
        </dict>
        <key>KeepAlive</key>
        <true/>
        <key>RunAtLoad</key>
        <true/>
</dict>
</plist>
