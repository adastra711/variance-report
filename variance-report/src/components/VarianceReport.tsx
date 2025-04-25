import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Button,
  Dropdown,
  Input,
  Textarea,
  Option,
  makeStyles,
  tokens,
  Field,
  Text,
  SelectionEvents,
  OptionOnSelectData,
  shorthands,
} from '@fluentui/react-components';
import { Document, Packer, Paragraph } from 'docx';
import { AzureOpenAI } from "openai";

const useStyles = makeStyles({
  root: {
    padding: tokens.spacingVerticalXXL,
    maxWidth: '800px',
    margin: '0 auto',
  },
  field: {
    marginBottom: tokens.spacingVerticalM,
  },
  buttons: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
  },
  entriesList: {
    marginTop: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
  },
  entryItem: {
    marginBottom: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  expandedDescription: {
    marginTop: tokens.spacingVerticalS,
    color: tokens.colorNeutralForeground2,
  },
  dropdown: {
    '& .fui-Listbox': {
      maxHeight: '300px',
      overflowY: 'auto',
      ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
    }
  }
});

const costCategories = [
  '1200-RMS-Cable Television',
  '1205-RMS-Operating Supplies/Office supplies',
  '1210-RMS-Cleaning Supplies',
  '1215-RMS-Laundry & Dry Cleaning',
  '1220-RMS-Contract Services',
  '1225-RMS-Guest Package',
  '1230-RMS-Guest Transportation',
  '1235-RMS-Guest Supplies',
  '1240-RMS-Equipment Rental',
  '1242-RMS-Small Equipment',
  '1245-RMS-Laundry Supplies',
  '1250-RMS-Miscellaneous',
  '1255-RMS-Office Supplies',
  '1260-RMS-Linen',
  '1265-RMS-Printing & Stationery',
  '1270-RMS-Central Reservations',
  '1275-RMS-Complimentary F&B',
  '1280-RMS-Newspapers',
  '1285-RMS-Reservations',
  '1290-RMS-PMS Support',
  '1295-RMS-Telephone',
  '1300-RMS-Postage',
  '1305-RMS-Travel Agent Commissions',
  '1310-RMS-Internet',
  '1315-RMS-Uniforms',
  '1320-RMS-Promotions',
  '1325-RMS-Guest Walks',
  '1330-RMS-Flowers & Decorations',
  '2100-FD-Mini Bar Food Cost',
  '2105-FD-Food Cost',
  '2110-FD-Employee Meal Credit',
  '2200-FD-Banquet Svce Charge (net)',
  '2205-FD-Contract Services',
  '2210-FD-Small Equipment',
  '2215-FD-Equipment Rental',
  '2220-FD-Promotions',
  '2225-FD-Linen',
  '2230-FD-Laundry/uniform cleaning',
  '2235-FD-Decorations',
  '2240-FD-Licenses & Fees',
  '2245-FD-Dues & Subscriptions',
  '2250-FD-Cleaning Supplies',
  '2255-FD-Printing & Stationery',
  '2260-FD-Menus',
  '2265-FD-Office Supplies',
  '2270-FD-Kitchen Supplies',
  '2275-FD-Paper Supplies',
  '2280-FD-Utensils',
  '2285-FD-China/Glass/Silver',
  '2290-FD-Kitchen Fuel',
  '2295-FD-Banquet Supplies',
  '2300-FD-Banquet Rentals',
  '2305-FD-Music & Entertainment',
  '2310-FD-Uniforms',
  '3100-BEV-Mini Bar Bev Consumed',
  '3105-BEV-Liquor Consumed',
  '3110-BEV-Wine Consumed',
  '3115-BEV-Beer Consumed',
  '3116-BEV-Cost of Mixers',
  '3120-BEV-PR Beverage Manager',
  '3122-BEV-PROMOTER FEES',
  '3123-BEV-DJ FEES',
  '3165-BEV-Contract labor',
  '3167-BEV-Overnight Security',
  '3170-BEV-Office Supplies',
  '3175-BEV-Security',
  '3180-BEV-Cleaning Supplies',
  '3185-BEV-Paper Supplies',
  '3190-BEV-Bar Supplies',
  '3195-BEV-Printing Supplies',
  '3200-BEV-Decorations',
  '3205-BEV-Licenses & Fees',
  '3210-BEV-Small Equipment',
  '3215-BEV-Music & Entertainment',
  '3220-BEV-China/Glass/Silver'
];

interface VarianceEntry {
  category: string;
  budgetAmount: number;
  actualAmount: number;
  varianceAmount: number;
  comment: string;
  fullDescription: string;
}

// Add delay function for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const VarianceReport: React.FC = () => {
  const styles = useStyles();
  const [entries, setEntries] = useState<VarianceEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<VarianceEntry>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Azure OpenAI client with Vite environment variables
  const client = new AzureOpenAI({
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || "",
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || "",
    apiVersion: "2024-02-15-preview",
  });

  useEffect(() => {
    // Check if required environment variables are present
    if (!import.meta.env.VITE_AZURE_OPENAI_API_KEY || 
        !import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || 
        !import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT) {
      setError("Missing required Azure OpenAI credentials. Please check your environment variables.");
      console.error("Missing environment variables:", {
        apiKey: !!import.meta.env.VITE_AZURE_OPENAI_API_KEY,
        endpoint: !!import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
        deployment: !!import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT
      });
    }
  }, []);

  const generateFullDescription = async (comment: string, category: string, varianceAmount: number) => {
    if (error) {
      throw new Error(error);
    }

    try {
      console.log('Starting Azure OpenAI generation with:', {
        comment,
        category,
        varianceAmount
      });
      
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          const prompt = `Use the input string as the basis for an expanded 2-3 sentence response which may serve as explanation of a variance on a monthly variance report for a hotel.  For example, if the input is "New PC for Front Desk," an appropriate response would be, "due to the purchase of a new computer for the Front Desk, necessary to maintain the number of active workstations for guest services.  Expense approved and anticipated."

Input: "${comment} (Category: ${category}, Variance: $${varianceAmount})"`;

          const response = await client.chat.completions.create({
            messages: [
              { role: "system", content: "You are a helpful assistant that generates professional variance report explanations." },
              { role: "user", content: prompt }
            ],
            model: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || "",
            temperature: 0.7,
            max_tokens: 150,
          });

          const generatedText = response.choices[0]?.message?.content;
          console.log('Received Azure OpenAI response:', generatedText);
          
          if (generatedText) {
            const cleanedText = generatedText.trim();
            
            if (cleanedText.length < 10) {
              throw new Error('Response too short');
            }

            return cleanedText;
          }

          throw new Error('Invalid response format');
        } catch (error) {
          console.error('Error details:', {
            error,
            attempt: retries + 1,
            maxRetries
          });

          retries++;
          if (error instanceof Error) {
            if (error.message.includes('429')) {
              const waitTime = Math.pow(2, retries) * 1000;
              console.log(`Rate limited, waiting ${waitTime}ms before retry ${retries}/${maxRetries}`);
              await delay(waitTime);
            } else {
              console.error('Non-rate-limit error:', error.message);
              if (retries === maxRetries) {
                throw error;
              }
              await delay(1000);
            }
          } else {
            console.error('Unknown error type:', error);
            if (retries === maxRetries) {
              throw new Error('Unknown error occurred');
            }
            await delay(1000);
          }
        }
      }
      
      throw new Error('Failed after maximum retries');
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Final error in generateFullDescription:', {
        error,
        message: error.message,
        stack: error.stack
      });
      
      alert(`Error generating description: ${error.message}. Please try again or contact support if the issue persists.`);
      return `Unable to generate detailed description due to error. Original comment: ${comment}`;
    }
  };

  const formatEntry = (entry: VarianceEntry) => {
    return `${entry.category}: Ended the month at an actual expense of $${entry.actualAmount.toLocaleString()} versus a budget of $${entry.budgetAmount.toLocaleString()}, resulting in a variance of $${entry.varianceAmount.toLocaleString()}. ${entry.fullDescription}`;
  };

  const handleSubmit = async () => {
    if (!currentEntry.category || !currentEntry.budgetAmount || !currentEntry.actualAmount || !currentEntry.comment) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const varianceAmount = Number(currentEntry.budgetAmount) - Number(currentEntry.actualAmount);
      const fullDescription = await generateFullDescription(
        currentEntry.comment,
        currentEntry.category,
        varianceAmount
      );

      const newEntry: VarianceEntry = {
        category: currentEntry.category,
        budgetAmount: Number(currentEntry.budgetAmount),
        actualAmount: Number(currentEntry.actualAmount),
        varianceAmount,
        comment: currentEntry.comment,
        fullDescription,
      };

      setEntries([...entries, newEntry]);
      setCurrentEntry({});
    } catch (error) {
      console.error('Error submitting entry:', error);
      alert('An error occurred while processing your entry. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDocument = () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: entries.map(entry => new Paragraph({
          text: formatEntry(entry)
        })),
      }],
    });

    Packer.toBlob(doc).then((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'variance-report.docx';
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  };

  return (
    <div className={styles.root}>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        <Field
          label="Cost Category"
          className={styles.field}
        >
          <Dropdown
            placeholder="Select a category"
            value={currentEntry.category}
            className={styles.dropdown}
            onOptionSelect={(event: SelectionEvents, data: OptionOnSelectData) => {
              if (data.optionValue) {
                setCurrentEntry({ ...currentEntry, category: data.optionValue });
              }
            }}
          >
            {costCategories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Dropdown>
        </Field>

        <Field
          label="Budget Amount"
          className={styles.field}
        >
          <Input
            type="number"
            value={currentEntry.budgetAmount?.toString() || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCurrentEntry({ ...currentEntry, budgetAmount: Number(e.target.value) })
            }
          />
        </Field>

        <Field
          label="Actual Amount"
          className={styles.field}
        >
          <Input
            type="number"
            value={currentEntry.actualAmount?.toString() || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCurrentEntry({ ...currentEntry, actualAmount: Number(e.target.value) })
            }
          />
        </Field>

        <Field
          label="Variance Comment"
          className={styles.field}
        >
          <Textarea
            value={currentEntry.comment || ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setCurrentEntry({ ...currentEntry, comment: e.target.value })
            }
          />
        </Field>

        <div className={styles.buttons}>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Add Entry'}
          </Button>
          {entries.length > 0 && (
            <Button onClick={generateDocument}>
              Generate Document
            </Button>
          )}
        </div>
      </form>

      {entries.length > 0 && (
        <div className={styles.entriesList}>
          <Text weight="semibold">Entries:</Text>
          {entries.map((entry, index) => (
            <div key={index} className={styles.entryItem}>
              <Text>
                {formatEntry(entry)}
              </Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VarianceReport; 