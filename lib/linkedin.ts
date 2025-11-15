import { prisma } from './prisma';

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  profilePicture?: {
    displayImage?: string;
  };
}

export async function getLinkedInProfile(accessToken: string): Promise<LinkedInProfile> {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`LinkedIn API error: ${response.statusText}`);
  }

  return response.json();
}

export async function publishPost(
  accessToken: string,
  content: string,
  mediaUrn?: string
): Promise<{ id: string }> {
  // First, get the user's LinkedIn URN
  const profile = await getLinkedInProfile(accessToken);
  
  // Prepare the post data
  const postData: any = {
    author: `urn:li:person:${profile.id}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: mediaUrn ? 'IMAGE' : 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  if (mediaUrn) {
    postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
      {
        status: 'READY',
        media: mediaUrn,
      },
    ];
  }

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to publish post: ${error}`);
  }

  return response.json();
}

export async function uploadMedia(
  accessToken: string,
  imageBuffer: Buffer,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  // Step 1: Get user profile to get person URN
  const profile = await getLinkedInProfile(accessToken);
  const personUrn = `urn:li:person:${profile.id}`;

  // Step 2: Register upload
  const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: personUrn,
        serviceRelationships: [
          {
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent',
          },
        ],
      },
    }),
  });

  if (!registerResponse.ok) {
    const error = await registerResponse.text();
    throw new Error(`Failed to register upload: ${error}`);
  }

  const registerData = await registerResponse.json();
  const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
  const asset = registerData.value.asset;

  // Step 3: Upload the image
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
    },
    body: imageBuffer,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload image: ${uploadResponse.statusText}`);
  }

  return asset;
}

export async function getUserAccessToken(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { linkedinAccessToken: true },
  });

  return user?.linkedinAccessToken || null;
}

