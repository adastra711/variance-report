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
import { getConfigValue } from "../config";

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

interface Entry {
  category: string;
  budgetAmount: number;
  actualAmount: number;
  comment: string;
  analysis?: string;
}

// Add delay function for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function VarianceReport() {
  const styles = useStyles();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<Entry>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [client, setClient] = useState<AzureOpenAI | null>(null);
  const [deployment, setDeployment] = useState<string | undefined>();

  useEffect(() => {
    async function initializeClient() {
      try {
        setIsLoading(true);
        setError(undefined);

        // Fetch configuration from API
        const response = await fetch('/api/config');
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.statusText}`);
        }
        const config = await response.json();
        const { AZURE_OPENAI_API_KEY: apiKey, AZURE_OPENAI_ENDPOINT: endpoint, AZURE_OPENAI_DEPLOYMENT: modelDeployment } = config;

        if (!apiKey || !endpoint || !modelDeployment) {
          throw new Error('Missing required configuration values');
        }

        const newClient = new AzureOpenAI({
          apiKey,
          endpoint,
          apiVersion: '2024-02-15-preview'
        });
        
        setClient(newClient);
        setDeployment(modelDeployment);
      } catch (err) {
        console.error('Failed to initialize Azure OpenAI client:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    initializeClient();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !deployment) {
      setError('Client not initialized');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await client.chat.completions.create({
        model: deployment,
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst assistant that provides detailed analysis of budget variances.'
          },
          {
            role: 'user',
            content: `Analyze this budget variance: Category: ${currentEntry.category}, Budget: ${currentEntry.budgetAmount}, Actual: ${currentEntry.actualAmount}, Comment: ${currentEntry.comment}`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const analysis = response.choices[0]?.message?.content || undefined;

      const newEntry: Entry = {
        category: currentEntry.category || '',
        budgetAmount: Number(currentEntry.budgetAmount) || 0,
        actualAmount: Number(currentEntry.actualAmount) || 0,
        comment: currentEntry.comment || '',
        analysis
      };

      setEntries([...entries, newEntry]);
      setCurrentEntry({});
    } catch (err) {
      console.error('Error submitting entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze entry');
    } finally {
      setIsLoading(false);
    }
  };

  const formatEntry = (entry: Entry) => {
    return `${entry.category}: Ended the month at an actual expense of $${entry.actualAmount.toLocaleString()} versus a budget of $${entry.budgetAmount.toLocaleString()}, resulting in a variance of $${(entry.actualAmount - entry.budgetAmount).toLocaleString()}. ${entry.analysis || ''}`;
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.root}>
      <form onSubmit={handleSubmit}>
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
} 