import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OpenAIApi, Configuration } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("CogitaChronicle");

  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  const blogContent = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called Cogita Chronicle. You are designed to output markdown without frontmatter",
      },
      {
        role: "user",
        content: `
            Generate me a long and detailed seo friendly blog post on the following topic delimited by triple hyphens:
            ---
            ${topic}
            ---
            Targeting the following separated keywords delimited by triple hyphens
            ---
            ${keywords}
            ---
            `,
      },
    ],
  });
  const postContent = blogContent.data.choices[0]?.message?.content;
  const blogTitle = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called Cogita Chronicle. You are designed to output JSON. Do not include HTML tags, brackets or speech marks in your output.",
      },
      {
        role: "user",
        content: `Generate a SEO friendly title for the following blog post ${postContent}. Make sure the title is short and succinct. Max 2 sentences. 
        ---
      
        
        
      
       }`,
      },
    ],
  });
  const blogDescription = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called Cogita Chronicle. You are designed to output JSON. Do not include HTML tags, brackets or speech marks in your output.",
      },
      {
        role: "user",
        content: `Generate a SEO friendly meta-description for the following blog post ${postContent}. Make sure it max 4 sentences long. It should be short and succinct.
        ---
       
       }`,
      },
    ],
  });
  const title = blogTitle.data.choices[0]?.message?.content;
  const metaDescription = blogDescription.data.choices[0]?.message?.content;

  await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  const post = await db.collection("posts").insertOne({
    postContent,
    title,
    metaDescription,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  });
  console.log(post);

  res.status(200).json({ postId: post.insertedId });
});
