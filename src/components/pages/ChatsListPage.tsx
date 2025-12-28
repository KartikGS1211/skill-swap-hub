import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { ChatConversations, UserProfiles } from '@/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import { MessageCircle, Archive } from 'lucide-react';
import { format } from 'date-fns';

interface ConversationWithUsers extends ChatConversations {
  otherUser?: UserProfiles;
  lastMessage?: string;
}

export default function ChatsListPage() {
  const { member } = useMember();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationWithUsers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      if (!member?._id) return;

      try {
        const { items } = await BaseCrudService.getAll<ChatConversations>('chatconversations');
        
        // Filter conversations where user is a participant
        const userConversations = items.filter(
          (conv) =>
            conv.participantOneId === member._id ||
            conv.participantTwoId === member._id
        );

        // Fetch user profiles for other participants
        const conversationsWithUsers = await Promise.all(
          userConversations.map(async (conv) => {
            const otherUserId =
              conv.participantOneId === member._id
                ? conv.participantTwoId
                : conv.participantOneId;

            if (!otherUserId) return conv;

            const otherUser = await BaseCrudService.getById<UserProfiles>(
              'userprofiles',
              otherUserId
            );

            return {
              ...conv,
              otherUser,
            };
          })
        );

        // Sort by last message date (newest first)
        conversationsWithUsers.sort((a, b) => {
          const dateA = new Date(a.lastMessageAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.lastMessageAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        setConversations(conversationsWithUsers);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [member?._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-heading font-bold text-textprimary mb-2">
            Messages
          </h1>
          <p className="text-lg font-paragraph text-textsecondary">
            Your active skill exchange conversations
          </p>
        </div>

        {conversations.length === 0 ? (
          <Card className="p-12 text-center border-2 border-textprimary/10">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-textsecondary/50" />
            <h2 className="text-2xl font-heading font-bold text-textprimary mb-2">
              No conversations yet
            </h2>
            <p className="text-base font-paragraph text-textsecondary/70 mb-6">
              Start a skill exchange by connecting with a matched user
            </p>
            <Button
              onClick={() => navigate('/matches')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View Matches
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Card
                key={conversation._id}
                className="p-4 border-2 border-textprimary/10 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/chat/${conversation._id}`)}
              >
                <div className="flex items-center gap-4">
                  {conversation.otherUser?.profilePicture && (
                    <Image
                      src={conversation.otherUser.profilePicture}
                      alt={conversation.otherUser.userName || 'User'}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-heading font-bold text-textprimary">
                      {conversation.otherUser?.userName || 'Unknown User'}
                    </h3>
                    <p className="text-sm font-paragraph text-textsecondary/70">
                      {conversation.otherUser?.city && `${conversation.otherUser.city} • `}
                      {conversation.status === 'active' ? 'Active' : 'Archived'}
                    </p>
                    {conversation.lastMessageAt && (
                      <p className="text-xs font-paragraph text-textsecondary/50 mt-1">
                        {format(new Date(conversation.lastMessageAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    )}
                  </div>
                  {conversation.status === 'archived' && (
                    <Archive className="w-5 h-5 text-textsecondary/50" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
