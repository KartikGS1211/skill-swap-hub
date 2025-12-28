import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import {
  ChatConversations,
  ChatMessages,
  UserProfiles,
  ContactExchangeRequests,
} from '@/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Send, Share2, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface ConversationWithUsers extends ChatConversations {
  otherUser?: UserProfiles;
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { member } = useMember();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversation, setConversation] = useState<ConversationWithUsers | null>(null);
  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [contactRequests, setContactRequests] = useState<ContactExchangeRequests[]>([]);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadChat = async () => {
      if (!id || !member?._id) return;

      try {
        // Load conversation
        const conv = await BaseCrudService.getById<ChatConversations>(
          'chatconversations',
          id
        );

        if (!conv) {
          navigate('/chats');
          return;
        }

        // Get other user
        const otherUserId =
          conv.participantOneId === member._id
            ? conv.participantTwoId
            : conv.participantOneId;

        const otherUser = otherUserId
          ? await BaseCrudService.getById<UserProfiles>('userprofiles', otherUserId)
          : undefined;

        setConversation({ ...conv, otherUser });

        // Load messages
        const { items: allMessages } = await BaseCrudService.getAll<ChatMessages>(
          'chatmessages'
        );
        const conversationMessages = allMessages
          .filter((msg) => msg.threadId === id)
          .sort(
            (a, b) =>
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
          );

        setMessages(conversationMessages);

        // Load contact exchange requests
        const { items: allRequests } = await BaseCrudService.getAll<
          ContactExchangeRequests
        >('contactexchangerequests');
        const conversationRequests = allRequests.filter(
          (req) => req.conversationId === id
        );
        setContactRequests(conversationRequests);
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChat();

    // Set up polling to fetch new messages every 2 seconds
    const pollInterval = setInterval(async () => {
      if (!id || !member?._id) return;

      try {
        const { items: allMessages } = await BaseCrudService.getAll<ChatMessages>(
          'chatmessages'
        );
        const conversationMessages = allMessages
          .filter((msg) => msg.threadId === id)
          .sort(
            (a, b) =>
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
          );

        setMessages(conversationMessages);

        // Also refresh contact requests
        const { items: allRequests } = await BaseCrudService.getAll<
          ContactExchangeRequests
        >('contactexchangerequests');
        const conversationRequests = allRequests.filter(
          (req) => req.conversationId === id
        );
        setContactRequests(conversationRequests);
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [id, member?._id, navigate]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !member?._id || !conversation?._id) return;

    setSending(true);
    try {
      const newMessage: ChatMessages = {
        _id: crypto.randomUUID(),
        threadId: conversation._id,
        authorId: member._id,
        content: messageInput,
        messageType: 'text',
        isRead: false,
        createdAt: new Date(),
      };

      await BaseCrudService.create('chatmessages', newMessage);

      // Update conversation's lastMessageAt
      await BaseCrudService.update('chatconversations', {
        _id: conversation._id,
        lastMessageAt: new Date(),
      });

      setMessages([...messages, newMessage]);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleRequestContact = async (contactType: string) => {
    if (!member?._id || !conversation?._id) return;

    try {
      const otherUserId =
        conversation.participantOneId === member._id
          ? conversation.participantTwoId
          : conversation.participantOneId;

      if (!otherUserId) return;

      const request: ContactExchangeRequests = {
        _id: crypto.randomUUID(),
        conversationId: conversation._id,
        requesterId: member._id,
        recipientId: otherUserId,
        contactTypeRequested: contactType,
        status: 'pending',
        createdAt: new Date(),
      };

      await BaseCrudService.create('contactexchangerequests', request);
      setContactRequests([...contactRequests, request]);
      setShowContactDialog(false);

      // Send system message
      const systemMessage: ChatMessages = {
        _id: crypto.randomUUID(),
        threadId: conversation._id,
        authorId: member._id,
        content: `Requested to share ${contactType}`,
        messageType: 'contact_request',
        isRead: false,
        createdAt: new Date(),
      };

      await BaseCrudService.create('chatmessages', systemMessage);
      setMessages([...messages, systemMessage]);
    } catch (error) {
      console.error('Error requesting contact:', error);
    }
  };

  const handleApproveContactRequest = async (requestId: string) => {
    try {
      await BaseCrudService.update('contactexchangerequests', {
        _id: requestId,
        status: 'approved',
        respondedAt: new Date(),
      });

      setContactRequests(
        contactRequests.map((req) =>
          req._id === requestId ? { ...req, status: 'approved' } : req
        )
      );
    } catch (error) {
      console.error('Error approving contact request:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-textprimary">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b-2 border-textprimary/10 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/chats')}
            className="p-2 hover:bg-textprimary/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-textprimary" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            {conversation.otherUser?.profilePicture && (
              <Image
                src={conversation.otherUser.profilePicture}
                alt={conversation.otherUser.userName || 'User'}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-xl font-heading font-bold text-textprimary">
                {conversation.otherUser?.userName || 'Unknown User'}
              </h1>
              <p className="text-sm font-paragraph text-textsecondary/70">
                {conversation.otherUser?.city || 'Location unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-textsecondary/50 font-paragraph">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.authorId === member?._id;
            const isPending = contactRequests.find(
              (req) =>
                req.requesterId === message.authorId &&
                req.messageType === message.messageType
            );

            return (
              <div
                key={message._id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-textprimary/5 text-textprimary'
                  }`}
                >
                  {message.messageType === 'contact_request' ? (
                    <div className="space-y-2">
                      <p className="font-paragraph text-sm">
                        {isOwn
                          ? 'You requested to share'
                          : 'Requested to share'}{' '}
                        <span className="font-bold">{message.content}</span>
                      </p>
                      {!isOwn && isPending?.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleApproveContactRequest(isPending._id)
                            }
                            className="text-xs"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs"
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                      {isPending?.status === 'approved' && (
                        <p className="text-xs font-paragraph opacity-75">
                          ✓ Approved
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-paragraph text-sm">{message.content}</p>
                  )}
                  <p
                    className={`text-xs font-paragraph mt-2 ${
                      isOwn ? 'opacity-75' : 'opacity-50'
                    }`}
                  >
                    {format(new Date(message.createdAt || 0), 'h:mm a')}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-textprimary/10 bg-white sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
          {/* Contact Exchange Requests */}
          {contactRequests.length > 0 && (
            <div className="space-y-2">
              {contactRequests
                .filter((req) => req.status === 'pending' && req.recipientId === member?._id)
                .map((request) => (
                  <Card key={request._id} className="p-3 bg-textsecondary/5 border border-textsecondary/20">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-paragraph text-textprimary">
                        User wants to share their {request.contactTypeRequested}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveContactRequest(request._id)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 border-2 border-textprimary/20 focus:border-primary"
              disabled={sending}
            />
            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-2 border-textprimary/20 hover:border-primary"
                >
                  <Share2 className="w-5 h-5 text-textprimary" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-heading">
                    Share Contact Information
                  </DialogTitle>
                  <DialogDescription className="font-paragraph">
                    Request to share your contact details with this user
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleRequestContact('email')}
                    className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Mail className="w-4 h-4" />
                    Share Email
                  </Button>
                  <Button
                    onClick={() => handleRequestContact('phone')}
                    className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Phone className="w-4 h-4" />
                    Share Phone
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || sending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
