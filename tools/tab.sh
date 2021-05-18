#!/usr/bin/osascript
on open_terminal(argv)
	tell application "Terminal"
		activate
		tell application "System Events" to keystroke "t" using command down
		repeat while contents of selected tab of window 1 starts with linefeed
		delay 0.2
		end repeat
		do script argv in window 1
	end tell
end open_terminal

on open_iterm(argv)
	tell application "iTerm"
		reopen
	end tell
	tell application "iTerm"
		tell current session of current window
			split vertically with default profile
		end tell
		tell current tab of current window
			set _new_session to last item of sessions
		end tell
		tell _new_session
			select
			write text argv as string
		end tell
	end tell
end open_iterm

on run argv
	try
		my open_iterm(argv)
		log "opened cmd: '" & argv & "' inside iTerm app"
	on error
		my open_terminal(argv)
		log "opened cmd: '" & argv & "' inside Terminal app"
	end try
end run