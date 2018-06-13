import { Component } from '@angular/core'
import { ChatService } from './chat.service'
import { AuthService } from '../../components/auth/auth.service'

/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'chat',
  template: require('./chat.html')
})
export class ChatComponent {
  static parameters = [ChatService, AuthService]

  constructor(chatService: ChatService, _AuthService: AuthService) {
    this.chatService = chatService
    this.AuthService = _AuthService
    this.reset()
    this.AuthService.currentUserChanged.subscribe((user) => {
      this.currentUser = user
      this.reset()
    })
  }

  reset() {
    this.isLoggedIn = this.AuthService.isLoggedInSync()
    this.isAdmin = this.AuthService.isAdminSync()
    this.AuthService.getCurrentUser().then((user) => {
      this.currentUser = user
    })
  }
}
