import torch
import torch.nn as nn

class NCF(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=50, layers=[128, 64, 32]):
        super(NCF, self).__init__()
        
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)
        
        # MLP layers
        self.fc_layers = nn.ModuleList()
        layer_dims = [2 * embedding_dim] + layers
        
        for i in range(len(layer_dims)-1):
            self.fc_layers.append(nn.Linear(layer_dims[i], layer_dims[i+1]))
            self.fc_layers.append(nn.ReLU())
            self.fc_layers.append(nn.Dropout(p=0.1))
        
        self.final_layer = nn.Linear(layer_dims[-1], 1)
        
    def forward(self, user_input, item_input):
        user_embedded = self.user_embedding(user_input)
        item_embedded = self.item_embedding(item_input)
        
        vector = torch.cat([user_embedded, item_embedded], dim=-1)
        
        for layer in self.fc_layers:
            vector = layer(vector)
            
        output = self.final_layer(vector)
        output = torch.clamp(output, min=0.0, max=5.0)
        
        return output.squeeze()