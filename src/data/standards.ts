export interface SourceParagraph {
  citation: string;
  title: string;
  description: string;
  id: string;
}

export interface JournalEntry {
  description: string;
  debit: string;
  credit: string;
  amount: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  issue: string;
  scenario: string;
  analysis: string;
  journalEntries: JournalEntry[];
}

export interface AccountingStandard {
  id: string; // e.g. "IFRS-15"
  code: string; // e.g. "IFRS 15"
  title: string;
  effectiveDate: string;
  summary: string;
  keyConcepts: string[];
  complianceChecklist: string[];
  sourceParagraphs: SourceParagraph[];
  caseStudies: CaseStudy[];
  detailedOverview?: string;
  specificProvisions?: { title: string; requirements: string }[];
  interpretationsText?: string;
  changesEffectiveThisYear?: string;
  pendingChanges?: string;
}

export const accountingStandardsList: AccountingStandard[] = [
  {
    id: "IFRS-15",
    code: "IFRS 15",
    title: "Revenue from Contracts with Customers",
    effectiveDate: "1 January 2018",
    summary: "Establishes a comprehensive framework for determining whether, how much, and when revenue is recognized. It replaces IAS 18 Revenue, IAS 11 Construction Contracts and related interpretations.",
    keyConcepts: [
      "The 5-Step Model for Revenue Recognition",
      "Identifying Distinct Performance Obligations",
      "Variable Consideration and the Constraint",
      "Adjustment for Significant Financing Component",
      "Point in Time vs Over Time Transfers of Control"
    ],
    complianceChecklist: [
      "Has the contract been approved and have parties agreed to their performance rights?",
      "Are payment terms and transaction price clearly determinable (considering variable bonuses)?",
      "Are goods/services distinct under Paragraph 27 criteria?",
      "If recognition is Over Time, is there an appropriate input or output method selected?",
      "Has contract liability/contract asset been presented separately in the financial statements?"
    ],
    detailedOverview: "IFRS 15 prescribes the accounting for revenue from sales of goods and rendering of services to a customer. It replaces IAS 18, IAS 11, and related interpretations. The core principle is that an entity recognizes revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services, using a robust five-step control model.",
    specificProvisions: [
      {
        title: "Contract with a Customer (IFRS 15.9)",
        requirements: "Within scope when contract has commercial substance, is approved by parties, rights and standard payment terms are identifiable, and collection is probable."
      },
      {
        title: "Core 5-Step Model",
        requirements: "Step 1: Identify contract. Step 2: Identify distinct performance obligations. Step 3: Determine transaction price. Step 4: Allocate transaction price to performance obligations based on relative standalone selling prices. Step 5: Recognise revenue when/as the entity satisfies each performance obligation by transferring control."
      },
      {
        title: "Application Guidance & Specific Cases",
        requirements: "Covers performance obligations satisfied over time, methods for measuring progress towards complete satisfaction, warranties, principal vs agent, licensing, repurchase arrangements, and bill-and-hold agreements."
      }
    ],
    interpretationsText: "None active specifically for this segment.",
    changesEffectiveThisYear: "None.",
    pendingChanges: "None indicated at 31 August 2025.",
    sourceParagraphs: [
      {
        id: "ifrs15-p9",
        citation: "IFRS 15 Paragraph 9",
        title: "Contract Identification Criteria",
        description: "An entity shall account for a contract with a customer that is within the scope of this Standard only when all of the following criteria are met: the parties have approved the contract; each party's rights can be identified; payment terms are identifiable; the contract has commercial substance; and collection is probable."
      },
      {
        id: "ifrs15-p22",
        citation: "IFRS 15 Paragraph 22",
        title: "Identifying Performance Obligations",
        description: "At contract inception, an entity shall assess the goods or services promised in a contract with a customer and shall identify as a performance obligation each promise to transfer to the customer either: a good or service (or a bundle of goods or services) that is distinct."
      },
      {
        id: "ifrs15-p31",
        citation: "IFRS 15 Paragraph 31",
        title: "Control and Performance Obligations",
        description: "An entity shall recognize revenue when (or as) the entity satisfies a performance obligation by transferring a promised good or service (i.e. an asset) to a customer. An asset is transferred when (or as) the customer obtains control of that asset."
      },
      {
        id: "ifrs15-p56",
        citation: "IFRS 15 Paragraph 56",
        title: "Constraining Estimates of Variable Consideration",
        description: "An entity shall include in the transaction price some or all of an amount of variable consideration estimated only to the extent that it is highly probable that a significant reversal in the amount of cumulative revenue recognized will not occur when the uncertainty is resolved."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs15-1",
        title: "Software Licensing with Premium Integration & Support",
        issue: "Are software license, custom integration, and technical updates separate performance obligations, and how should transaction price be allocated?",
        scenario: "Apex Tech sells a customized enterprise accounting software product for a package price of $500,000. Under the contract, Apex provides: (1) A standard software license, (2) Highly complex custom implementation that modifies the product's underlying database structures, and (3) 2 years of automated security updates. Standalone selling prices can be reliably determined as: License $180,000, Integration $320,000, Updates $100,000. Apex initially wanted to recognize the entire $500,000 upon delivery of the software license key.",
        analysis: "Under IFRS 15.27, standard licensing and integration are NOT distinct because Apex's implementation services alter the core system code—they are highly integrated. Therefore, (1) and (2) form a combined performance obligation satisfied over the implementation duration. The security updates are distinct and constitute a separate performance obligation satisfied over 2 years. The total transaction price must be allocated relative to standalone selling prices: Combined core solution (5/6 of SSP) receives $416,667, Updates (1/6 of SSP) receive $83,333.",
        journalEntries: [
          {
            description: "To record initial invoice generation and cash received at contract signing:",
            debit: "Cash / Trade Receivables",
            credit: "Deferred Customer Contract Liabilities",
            amount: "$500,000"
          },
          {
            description: "To recognize implementation progress (assuming linear progress milestone at Year 1 of 50% on Core Implementation):",
            debit: "Deferred Customer Contract Liabilities",
            credit: "Customer Account Revenue (Core Solution)",
            amount: "$208,333"
          },
          {
            description: "To recognize year 1 of automated security updates (50% progress over tenure):",
            debit: "Deferred Customer Contract Liabilities",
            credit: "Customer Account Revenue (Updates Services)",
            amount: "$41,667"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-16",
    code: "IFRS 16",
    title: "Leases",
    effectiveDate: "1 January 2019",
    summary: "Replaces IAS 17 Leases. It introduces a single lessee accounting model, requiring lessees to recognize assets (Right-of-Use asset) and liabilities for all leases unless the lease term is 12 months or less or the underlying asset is of low value.",
    keyConcepts: [
      "Definition of a Lease (Identified Asset & Control of Use)",
      "Right-of-Use (ROU) Asset Initial Measurement & Depreciation",
      "Lease Liability & Incremental Borrowing Rate (IBR)",
      "Lease Term & Renewal Options Assessment",
      "Short-term and Low-value Exemptions (under $5,000)"
    ],
    complianceChecklist: [
      "Is the asset specifically identified in the contract (no substantive substitution rights for supplier)?",
      "Does the lessee have the right to obtain substantially all economic benefits from use?",
      "Has the incremental borrowing rate been correctly computed if the implicit rate is unknown?",
      "Have termination penalties and renewal option periods been included in the lease term calculations?",
      "Are lease modifications accounted for as separate leases or adjustments to the existing ROU and liability?"
    ],
    detailedOverview: "IFRS 16 sets out the principles for the recognition, measurement, presentation, and disclosure of leases, introducing a single lessee accounting model which eliminates the classification of leases as operating or finance for lessees.",
    specificProvisions: [
      {
        title: "Accounting by a Lessee",
        requirements: "Lessees are required to recognize a right-of-use asset and a lease liability. The right-of-use asset is measured initially at cost (comprising lease liability present value, initial direct costs, and restoration estimates) and subsequently depreciated in accordance with IAS 16. Lease liability is measured at the present value of the lease payments payable over the term."
      },
      {
        title: "Accounting by a Lessor",
        requirements: "Lessors continue to distinguish between operating and finance leases. A lease is classified as a finance lease if it transfers substantially all risks and rewards incidental to ownership."
      },
      {
        title: "Sale and Leaseback Transactions",
        requirements: "The transfer of the asset must be evaluated under IFRS 15 to determine if it is a sale. If it qualifies, the seller measures the right-of-use asset at the proportion of the previous carrying amount that relates to the right of use retained."
      }
    ],
    interpretationsText: "None active.",
    changesEffectiveThisYear: "None.",
    pendingChanges: "In June 2025, the IASB published Request for Information (RFI) Post-implementation Review of IFRS 16 Leases to seek feedback. Also, a narrow-scope project exists on sale and leaseback of an asset in a single-asset entity within the maintenance pipeline.",
    sourceParagraphs: [
      {
        id: "ifrs16-p22",
        citation: "IFRS 16 Paragraph 22",
        title: "Recognition of RoU Asset and Lease Liability",
        description: "At the commencement date, a lessee shall recognise a right-of-use asset and a lease liability."
      },
      {
        id: "ifrs16-p26",
        citation: "IFRS 16 Paragraph 26",
        title: "Measuring Lease Liability",
        description: "At the commencement date, a lessee shall measure the lease liability at the present value of the lease payments that are not paid at that date. The lease payments shall be discounted using the interest rate implicit in the lease, or if that is not easily determinable, the lessee's incremental borrowing rate."
      },
      {
        id: "ifrs16-p30",
        citation: "IFRS 16 Paragraph 30",
        title: "Subsequent Measurement of RoU Asset",
        description: "After the commencement date, a lessee shall measure the right-of-use asset applying a cost model, unless it applies another measurement model. Under the cost model, the lessee measures the right-of-use asset at cost less any accumulated depreciation and accumulated impairment losses."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs16-1",
        title: "Office Space Rental with Rent-Free Incentives",
        issue: "How is a leases liability and ROU asset computed when there is a rent-free period and initial direct cost?",
        scenario: "Globex Corp enters into a 5-year lease of office building starting Jan 1, 2026. Annual lease payments are $100,000, payable in arrears. However, Year 1 is rent-free. Globex incurs initial legal costs of $15,000. The incremental borrowing rate is determined to be 6%.",
        analysis: "Under IFRS 16, lease payments consist of: Year 1: $0, Year 2-5: $100,000 each. Total payments = $400,000. Let's discount the cash outflows in years 2, 3, 4, 5 to present value on Jan 1, 2026 at 6%: PV of lease liability is $100K/(1.06)^2 + $100K/(1.06)^3 + $100K/(1.06)^4 + $100K/(1.06)^5 = $89,000 + $83,962 + $79,209 + $74,726 = $326,897. ROU Asset cost includes: Lease liability PV ($326,897) + Initial direct costs ($15,000) = $341,897. Depreciation for the asset is straight-line over 5 years ($68,379/Year). Interest expense is computed annually on the outstanding liability balance at 6%.",
        journalEntries: [
          {
            description: "At commencement (1 January 2026) to recognize ROU asset, lease liability and payment of direct costs:",
            debit: "ROU Asset $341,897",
            credit: "Lease Liability $326,897 | Cash (Legal fees) $15,000",
            amount: "$341,897"
          },
          {
            description: "End of Year 1: To record interest accrual on lease liability (no cash is paid due to lease holiday):",
            debit: "Finance Fees / Interest Expense",
            credit: "Lease Liability",
            amount: "$19,614"
          },
          {
            description: "End of Year 1: To record straight-line depreciation of ROU Asset over lease term:",
            debit: "Depreciation Expense",
            credit: "Accumulated Depreciation - ROU Asset",
            amount: "$68,379"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-9",
    code: "IFRS 9",
    title: "Financial Instruments",
    effectiveDate: "1 January 2018",
    summary: "Governs classification, measurement, impairment, and hedge accounting of financial assets & liabilities. Replaces IAS 39 and introduces the Expected Credit Loss (ECL) forward-looking model for impairment.",
    keyConcepts: [
      "Classification of Assets: Amortised Cost vs FVOCI vs FVTPL",
      "Business Model Assessment & SPPI (Solely Payments of Principal and Interest) Test",
      "Expected Credit Loss (ECL) Impairment Stages (1, 2, and 3)",
      "Derecognition of Financial Assets & Factoring Controls",
      "Hedge Effectiveness and Documentation alignment"
    ],
    complianceChecklist: [
      "Do the financial assets pass the SPPI contract tests (no equity-linked features or option conversions)?",
      "What business model governs the asset portfolio: 'Hold to Collect' (Amortised Cost), 'Hold & Sell' (FVOCI), or 'Trading/Other' (FVTPL)?",
      "Has there been a Significant Increase in Credit Risk (SICR) triggering Stage 2 ECL impairment calculation?",
      "Are all trade receivables without a significant financing component measured under the simplified ECL matrix?",
      "Are financial liabilities measured at amortised cost unless selected for FV option to prevent accounting mismatch?"
    ],
    detailedOverview: "IFRS 9 sets out requirements for recognition, measurement, impairment, derecognition, and general hedge accounting of financial instruments.",
    specificProvisions: [
      {
        title: "Classification & Classification Tests",
        requirements: "Financial assets are classified into three subsequent measurement categories (Amortised Cost, FVOCI, FVTPL) based on both: (a) the entity's business model for managing the assets and (b) the contractual cash flow characteristics of the asset (the 'Solely Payments of Principal and Interest' or SPPI test)."
      },
      {
        title: "Expected Credit Loss (ECL) Impairment Model",
        requirements: "Under the general approach, loss allowances are measured at 12-month ECL (Stage 1) or lifetime ECL (Stage 2 if credit risk has increased significantly since initial recognition; Stage 3 if credit-impaired). Simple trade receivables use a simplified approach without tracking Stage progression."
      },
      {
        title: "Financial Liabilities & Derivatives",
        requirements: "Financial liabilities are measured at amortised cost unless designated at FVTPL (where credit-risk related FV changes go to OCI). All derivatives in the scope of IFRS 9 are recorded at fair value."
      },
      {
        title: "Hedge Accounting (Hedge Relationships)",
        requirements: "Hedge accounting requirements are optional and permit entities to reflect risk management activities in accounts. Includes Fair value hedges, Cash flow hedges, and hedges of a net investment in a foreign operation."
      }
    ],
    interpretationsText: "IFRIC 16 Hedges of a Net Investment in a Foreign Operation (direct accounting is similar to cash flow hedges). IFRIC 19 Extinguishing Financial Liabilities with Equity Instruments.",
    changesEffectiveThisYear: "None.",
    pendingChanges: "May 2024 Amendments to the Classification and Measurement of Financial Instruments (effective 1 January 2026), implementing disclosure of contractual terms that change cash flow timing. December 2024 Amendments on Contracts Referencing Nature-dependent Electricity (effective 1 January 2026).",
    sourceParagraphs: [
      {
        id: "ifrs9-p411",
        citation: "IFRS 9 Paragraph 4.1.1",
        title: "Classification of Financial Assets",
        description: "Unless paragraph 4.1.5 applies, an entity shall classify financial assets as subsequently measured at amortised cost, fair value through other comprehensive income, or fair value through profit or loss on the basis of both: (a) the entity's business model for managing the financial assets and (b) the contractual cash flow characteristics of the financial asset."
      },
      {
        id: "ifrs9-p553",
        citation: "IFRS 9 Paragraph 5.5.3",
        title: "ECL Impairment - General Approach",
        description: "At each reporting date, an entity shall measure the loss allowance for a financial instrument at an amount equal to the lifetime expected credit losses if the credit risk on that financial instrument has increased significantly since initial recognition."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs9-1",
        title: "Trade Receivables Aging and Simplified ECL Impairment Matrix",
        issue: "How is a provision matrix used for trade receivables under the simplified approach of IFRS 9?",
        scenario: "Delphi Trade has a trade receivable portfolio of $2,000,000 on December 31, 2026. Delphi uses a simplified ECL matrix based on historical defaults adjusted for forward-looking macroeconomic outlook. The portfolio age detail holds: Current ($1,200K, default 0.5%), Past Due 1-30 days ($500K, default 2%), Past Due 31-90 days ($200K, default 8%), and Past Due > 90 days ($100K, default 30%). The existing provision allowance account sits at a credit balance of $25,000.",
        analysis: "Under the IFRS 9 simplified approach, the entity does not track Stage progression but always measures lifetime Expected Credit Losses. Total ECL calculation: Current: $1.2M * 0.5% = $6,000 | 1-30 days: $500K * 2% = $10,000 | 31-90 days: $200K * 8% = $16,000 | > 90 days: $100K * 30% = $30,000. Total required credit loss reserve = $6,000 + $10,000 + $16,000 + $30,000 = $62,000. The current credit balance is $25,000, so Delphi must record an incremental bad debt provision of $37,000 ($62,000 - $25,000).",
        journalEntries: [
          {
            description: "To adjust expected credit loss allowance database to calculated matrix value:",
            debit: "Impairment Loss on Financial Assets (Profit & Loss)",
            credit: "Provision for Expected Credit Loss (Receivable Contra)",
            amount: "$37,000"
          }
        ]
      }
    ]
  },
  {
    id: "IAS-16",
    code: "IAS 16",
    title: "Property, Plant and Equipment",
    effectiveDate: "1 January 2005",
    summary: "Sets out accounting treatment for tangible assets used in operations, detailing initial capitalization of costs (purchase price, site prep, installation, dismantling liabilities) and subsequent depreciation, revaluation, or cost depreciation.",
    keyConcepts: [
      "Inclusion of Direct Installation and Site Prep Costs",
      "Estimate of Dismantling and Site Restoration Obligation",
      "Cost Model vs Revaluation Model (Accounting for Revaluation Surplus)",
      "Component Depreciation (Separate schedules for parts with significant costs)",
      "Review of Residual Value and Useful life annually"
    ],
    complianceChecklist: [
      "Have subsequent direct costs of repairing or maintaining the asset been charged to P&L?",
      "Are borrowing costs directly attributable to qualifying plant construction capitalized under IAS 23?",
      "Is revaluation surplus presented in other comprehensive income (OCI) and tracked in Equity?",
      "Has a provision for dismantling been recognized as part of initial cost with a matching IAS 37 provision?",
      "Is the depreciation charge based on components if parts like airplane engines have distinct useful lives?"
    ],
    detailedOverview: "IAS 16 establishes the principles for the accounting treatment of Property, Plant, and Equipment (PP&E), so that users of financial statements can discern information about an entity's investment in its PP&E and changes in such investment.",
    specificProvisions: [
      {
        title: "Initial Recognition and Cost Elements (IAS 16.16)",
        requirements: "Cost comprises its purchase price (including import duties and non-refundable taxes), directly attributable costs to bring the asset to location and condition for operation, and the initial estimate of dismantling and restoring the site."
      },
      {
        title: "Subsequent Measurement - cost vs revaluation model",
        requirements: "An entity chooses either: (a) the cost model (carried at cost less accumulated depreciation and impairment) or (b) the revaluation model (carried at revalued amount, being fair value at revaluation date less subsequent depreciation)."
      },
      {
        title: "Component Depreciation (IAS 16.43/44)",
        requirements: "Each part of an item of PP&E with a cost that is significant in relation to the total cost of the item must be depreciated separately (e.g., airframe and engines of an aircraft)."
      }
    ],
    interpretationsText: "IFRIC 1 Changes in Existing Decommissioning, Restoration and Similar Liabilities. IFRIC 20 Stripping Costs in the Production Phase of a Surface Mine.",
    changesEffectiveThisYear: "None.",
    pendingChanges: "None indicated at 31 August 2025.",
    sourceParagraphs: [
      {
        id: "ias16-p16",
        citation: "IAS 16 Paragraph 16",
        title: "Elements of Capitalised Cost",
        description: "The cost of an item of property, plant and equipment comprises: (a) its purchase price, including import duties and non-refundable purchase taxes, after deducting trade discounts and rebates; (b) any costs directly attributable to bringing the asset to the location and condition necessary for it to be capable of operating in the manner intended by management; (c) the initial estimate of the costs of dismantling and removing the item and restoring the site."
      },
      {
        id: "ias16-p31",
        citation: "IAS 16 Paragraph 31",
        title: "The Revaluation Model",
        description: "After recognition as an asset, an item of property, plant and equipment whose fair value can be measured reliably shall be carried at a revalued amount, being its fair value at the date of the revaluation less any subsequent accumulated depreciation and subsequent accumulated impairment losses."
      }
    ],
    caseStudies: [
      {
        id: "cs-ias16-1",
        title: "Factory Machine with Dismantling Obligation & Safety Checks",
        issue: "How is a mechanical asset initially recognized when it requires future site restoration and safety certification?",
        scenario: "Summit Metals constructs a specialized factory press on 1 Jan 2026. Costs incurred include: Materials $800,000, Direct installation labor $120,000, General training for factory workers to handle the machine $40,000, Administrative operations team overhead $15,000, and a statutory requirement to dismantle the press and clean soil damage at the end of 10 years. Expected dismantling cost is $150,000. Under IAS 37, the present value of this liability is calculated using active risk-free rate of 5% ($92,087).",
        analysis: "Under IAS 16 direct allocation requirements: Eligible cost elements include purchase materials ($800,000), installation labor ($120,000), and site restoration present value ($92,087) = $1,012,087. Staff training ($40,000) and general administrative overhead ($15,000) do NOT qualify under IAS 16 and must be immediately expensed to the Statement of Profit or Loss. The press will be depreciated over its 10-year useful life, while the IAS 37 decommissioning provision is unwound annually recognizing finance interest cost.",
        journalEntries: [
          {
            description: "At commissioning to capitalize cost of machine and establish dismantling provision reserve:",
            debit: "Property, Plant and Equipment (Specialpress)",
            credit: "Cash / Accounts Payable $920,000 | Provision for Dismantling Obligation $92,087",
            amount: "$1,012,087"
          },
          {
            description: "To charge non-eligible items to period expenditure:",
            debit: "Staff Training Expense $40,000 | Administrative Operating Expense $15,000",
            credit: "Cash / Accrued Liabilities",
            amount: "$55,000"
          },
          {
            description: "End of Year 1: Recognition of depreciation ($1,012,087 over 10 years):",
            debit: "Depreciation Expense (Factory)",
            credit: "Accumulated Depreciation - Plant and Equipment",
            amount: "$101,209"
          },
          {
            description: "End of Year 1: Record finance unwind on dismantling provision (5% of $92,087):",
            debit: "Finance Costs (Discount Unwinding)",
            credit: "Provision for Dismantling Obligation",
            amount: "$4,604"
          }
        ]
      }
    ]
  },
  {
    id: "IAS-36",
    code: "IAS 36",
    title: "Impairment of Assets",
    effectiveDate: "1 January 2005",
    summary: "Ensures that assets are carried at no more than their recoverable amount. Details calculation of impairment losses, treatment of Cash-Generating Units (CGUs), and reallocation of goodwill impairment.",
    keyConcepts: [
      "Recoverable Amount: Higher of Useful Value (VIU) and Fair Value Less Costs (FVLCD)",
      "Cash-Generating Units (CGUs) definitions",
      "Allocating Impairment Steps: Goodwill first, then pro-rata to other assets",
      "Internal and External indicators of impairment",
      "Reversal of Impairment regulations (Goodwill never reversed)"
    ],
    complianceChecklist: [
      "Has an annual impairment test been completed for goodwill or intangible assets with indefinite useful lives regardless of indications?",
      "Are macroeconomic indicators (interest rates, stock market declines) reviewed at reporting date?",
      "For Value in Use (VIU), are discount rates pre-tax rates reflecting current risk-free interest and corporate risk premiums?",
      "Has any impairment loss on a CGU been allocated to goodwill first to reduce it to zero?",
      "Does the allocation of impairment avoid carrying any individual asset below the highest of FVLCD, VIU, or zero?"
    ],
    detailedOverview: "IAS 36 seeks to ensure that an entity's assets are not carried at more than their recoverable amount (the maximum amount to be recovered through use or sale of the asset).",
    specificProvisions: [
      {
        title: "Indications and Testing (IAS 36.9)",
        requirements: "An entity must assess at the end of each reporting period whether there is any indication that an asset may be impaired. Irrespective of indication, annual impairment tests are mandatory for: (a) intangible assets with an indefinite useful life, (b) intangible assets not yet available for use, and (c) goodwill acquired in a business combination."
      },
      {
        title: "Measuring Recoverable Amount",
        requirements: "Recoverable amount is the higher of an asset's or cash-generating unit's (CGU's): (a) Fair value less costs of disposal (FVLCD) and (b) Value in use (VIU)."
      },
      {
        title: "Impairment Allocation in Cash-Generating Units (CGUs)",
        requirements: "An impairment loss for a CGU is allocated: first to reduce the carrying amount of any goodwill allocated to the CGU, and then to the other assets of the CGU pro-rata on the basis of the carrying amount of each asset in the unit."
      },
      {
        title: "Reversals of Impairment Losses (IAS 36.110)",
        requirements: "An impairment loss recognized in prior periods for assets other than goodwill shall be reversed if, and only if, there has been a change in the estimates used to determine the asset's recoverable amount. Reversals of impairment on goodwill are strictly prohibited."
      }
    ],
    interpretationsText: "None active specifically for this segment.",
    changesEffectiveThisYear: "None.",
    pendingChanges: "The March 2024 Exposure Draft 'Business Combinations — Disclosures, Goodwill and Impairment' proposes targeted amendments to IAS 36 to remove some shieldings/over-optimism of goodwill testing.",
    sourceParagraphs: [
      {
        id: "ias36-p9",
        citation: "IAS 36 Paragraph 9",
        title: "Impairment Indicators check",
        description: "An entity shall assess at the end of each reporting period whether there is any indication that an asset may be impaired. If any such indication exists, the entity shall estimate the recoverable amount of the asset."
      },
      {
        id: "ias36-p18",
        citation: "IAS 36 Paragraph 18",
        title: "Recoverable Amount Definition",
        description: "This Standard defines recoverable amount as the higher of an asset's or cash-generating unit's fair value less costs of disposal and its value in use."
      },
      {
        id: "ias36-p104",
        citation: "IAS 36 Paragraph 104",
        title: "Allocating Impairment to CGU Assets",
        description: "The impairment loss shall be allocated to reduce the carrying amount of the assets of the unit (or group of units) in the following order: (a) first, to reduce the carrying amount of any goodwill allocated to the cash-generating unit (or group of units); and (b) then, to the other assets of the unit (or group of units) pro-rata on the basis of the carrying amount of each asset in the unit."
      }
    ],
    caseStudies: [
      {
        id: "cs-ias36-1",
        title: "Mining Division Cash Generating Unit (CGU) Write-Down",
        issue: "How is an impairment loss allocated across goodwill and tangible equipment inside a single cash-generating unit?",
        scenario: "Vanguard Mining operates a gold mining site that represents a single Cash Generating Unit (CGU). Lower globally traded market price of commodities triggers an impairment test at December 31, 2026. The carrying values within the CGU are: Goodwill $120,000, Factory Infrastructure $300,000, Mining Equipment $180,000, Land Rights $200,000. The total carrying block is $800,000. Vanguard calculates: Fair Value Less Costs of Disposal (FVLCD) is $520,000. Value in Use (VIU) computed using discounted cash flows at pre-tax rate is $550,000. (The land rights cannot be sold individually for more than $190,000).",
        analysis: "1. Determine Recoverable Amount: Higher of FVLCD ($520,000) and VIU ($550,000) = Recoverable Amount is $550,000.\n2. Compute Impairment Loss: Carrying Book Amount ($800,000) less Recoverable amount ($550,000) = $250,000 impairment loss.\n3. Allocation Order:\n   - Step A: Erase CGU Goodwill entirely ($120,000 allocate, leaving CGU goodwill at $0).\n   - Step B: Remaining loss to allocate is $130,000 ($250,000 - $120,000).\n   - Step C: Allocate $130,000 proportionally based on remaining book values: Factory Infrastructure ($300K, 44.1%), Mining Equipment ($180K, 26.5%), Land Rights ($200K, 29.4%).\n     - Infrastructure receives: $130,000 * (300/680) = $57,353 (New Carrying: $242,647)\n     - Mining Equipment receives: $130,000 * (180/680) = $34,412 (New Carrying: $145,588)\n     - Land Rights receives: $130,000 * (200/680) = $38,235 (New Carrying: $161,765). However, we must verify that Land Rights is not written below its individual recoverable amount of $190K. Since the calculated $161,765 is below $190,000, we limit the allocation of Land Rights loss to $10,000 (reducing carrying from $200,000 to $190,000 limit). The remaining deficit of $28,235 is re-allocated to Infrastructure and Equipment pro-rata (300/480 and 180/480).",
        journalEntries: [
          {
            description: "To record corporate impairment allocation to the statement of comprehensive income:",
            debit: "Impairment Expense on Tangible Assets & Goodwill (P&L)",
            credit: "Impairment Loss Provision - Goodwill $120,000 | Impairment Loss Provision - Infrastructure $75,000 | Impairment Loss Provision - Mining Equipment $45,000 | Impairment Loss Provision - Land Rights $10,000",
            amount: "$250,000"
          }
        ]
      }
    ]
  },
  {
    id: "IAS-37",
    code: "IAS 37",
    title: "Provisions, Contingent Liabilities & Assets",
    effectiveDate: "1 January 1999",
    summary: "Specifies standards for reporting provisions (liabilities of uncertain timing or amount) and contingent items. A provision is only recognized when there is a present obligation from a past event, probable outflow, and reliable estimate.",
    keyConcepts: [
      "Definition of Legal vs Constructive Obligation",
      "Restructuring Provisions strict eligibility criteria",
      "Onerous Contracts calculations (Lease breaks, supply contracts)",
      "Reimbursements (Insurance settlements separation rules)",
      "Contingent Asset disclosure limitations (Virtually certain threshold)"
    ],
    complianceChecklist: [
      "Is the outflow of resources highly probable (>50%) or merely possible?",
      "Have provisions been reviewed and adjusted at each balancing date to reflect current best forecasts?",
      "If a provision is computed over a long duration, has the liability been discounted to present value using a risk-free rate?",
      "Is a restructuring provision announced in detail to affected parties before the reporting date?",
      "Have future operating losses been excluded from the calculations as they fail the past-event test?"
    ],
    detailedOverview: "IAS 37 prescribes the appropriate recognition criteria and measurement bases for provisions, contingent liabilities, and contingent assets, ensuring that sufficient information is disclosed in notes.",
    specificProvisions: [
      {
        title: "Provisions Recognition Criteria (IAS 37.14)",
        requirements: "Recognised only when: (a) an entity has a present obligation (legal or constructive) as a result of a past event; (b) it is probable that an outflow of resources embodying economic benefits will be required to settle the obligation; and (c) a reliable estimate can be made of the amount of the obligation."
      },
      {
        title: "Onerous Contracts",
        requirements: "If an entity has a contract that is onerous (unavoidable costs of meeting obligations exceed expected economic benefits), the present obligation under the contract must be recognized and measured as a provision."
      },
      {
        title: "Contingent Liabilities (IAS 37.27)",
        requirements: "A contingent liability is not recognized in the statement of financial position but disclosed in notes, unless the possibility of an outflow of resources is remote."
      },
      {
        title: "Contingent Assets (IAS 37.31)",
        requirements: "A contingent asset is not recognized, but disclosed when an inflow of economic benefits is probable. When the realization of income is virtually certain, the related asset is not a contingent asset and its recognition is appropriate."
      }
    ],
    interpretationsText: "IFRIC 1 Changes in Existing Decommissioning, Restoration and Similar Liabilities. IFRIC 5 Rights to Interests arising from Decommissioning, Restoration and Environmental Rehabilitation Funds. IFRIC 21 Levies.",
    changesEffectiveThisYear: "None.",
    pendingChanges: "In November 2024, the IASB published the Exposure Draft 'Provisions — Targeted Improvements' which proposes to amend IAS 37 to align the definition of a liability with the Conceptual Framework, withdraw IFRIC 21, and clarify interest discount rate selections.",
    sourceParagraphs: [
      {
        id: "ias37-p14",
        citation: "IAS 37 Paragraph 14",
        title: "Provisions Recognition Criteria",
        description: "A provision shall be recognised when: (a) an entity has a present obligation (legal or constructive) as a result of a past event; (b) it is probable that an outflow of resources embodying economic benefits will be required to settle the obligation; and (c) a reliable estimate can be made of the amount of the obligation."
      },
      {
        id: "ias37-p66",
        citation: "IAS 37 Paragraph 66",
        title: "Onerous Contracts",
        description: "If an entity has a contract that is onerous, the present obligation under the contract shall be recognised and measured as a provision."
      }
    ],
    caseStudies: [
      {
        id: "cs-ias37-1",
        title: "Defective Product Warranty and Voluntary Recall Campaign",
        issue: "How is a constructive warranty pool estimated and accounted for when no legal claims have been formally filed?",
        scenario: "Pristine Vehicles is a manufacturer that sells vehicles under standard 3-year performance guarantees. In October 2026, a mechanical flaw is detected in 1,000 vehicles sold. Pristine immediately issues a voluntary service recall, committing to fix all vehicles free of charge. Pristine estimates that 60% of owners will return vehicles for low repairs costing $400 each, 30% for major repairs of $1,500 each, and 10% will not respond.",
        analysis: "Under IAS 37, a constructive obligation is active because Pristine publicly announced its defect notice and recall, creating a valid expectation among owners. The estimate must reflect expected payouts weighted by statistical probabilities. Total Expected Costs: (60% * 1000 * $400 = $240,000) + (30% * 1000 * $1,500 = $450,000) + (10% * 1000 * $0) = $240,000 + $450,000 = $690,000. A warranty provision of $690,000 must be immediately recognized in operating expenses on 31 Dec 2026.",
        journalEntries: [
          {
            description: "To establish warranty provision on 31 December 2026:",
            debit: "Cost of Warranty Sales / Quality Expense (P&L)",
            credit: "Provision for Product Warranties (Current Liability)",
            amount: "$690,000"
          }
        ]
      }
    ]
  },
  {
    id: "IAS-2",
    code: "IAS 2",
    title: "Inventories",
    effectiveDate: "1 January 2005",
    summary: "Prescribes the measurement and classification of inventory. Inventory is measured at the lower of Cost and Net Realizable Value (NRV). Cost formulas allowed are FIFO or Weighted Average Cost; LIFO is strictly forbidden.",
    keyConcepts: [
      "Lower of Cost and Net Realisable Value (NRV)",
      "Eligible Costs (Purchase price, transport, conversion, directly attributable duties)",
      "Excluded Costs (Abnormal waste, administrative overhead, storage costs unless required)",
      "Cost formulas allocation: FIFO vs Weighted Average Cost",
      "Disclosure of write-downs and reversal events"
    ],
    complianceChecklist: [
      "Has LIFO been excluded as a cost formula?",
      "Are conversion costs based on normal production capacity rather than actual low output levels?",
      "Have selling, distribution, and storage costs been correctly expensed as period costs rather than capitalized?",
      "Is NRV evaluated item-by-item or by groups of similar lines to ensure specific items are not masked?",
      "Are inventory write-downs presented in Cost of Goods Sold?"
    ],
    sourceParagraphs: [
      {
        id: "ias2-p9",
        citation: "IAS 2 Paragraph 9",
        title: "Measurement Rule of Inventories",
        description: "Inventories shall be measured at the lower of cost and net realizable value."
      },
      {
        id: "ias2-p10",
        citation: "IAS 2 Paragraph 10",
        title: "Components of Inventory Cost",
        description: "The cost of inventories shall comprise all costs of purchase, costs of conversion and other costs incurred in bringing the inventories to their present location and condition."
      }
    ],
    caseStudies: [
      {
        id: "cs-ias2-1",
        title: "Raw Material Costing vs Deteriorated Net Realizable Value",
        issue: "How is an inventory write-down measured when selling fees are high and materials have partially decayed?",
        scenario: "Solomon Agri holds a stockpile of premium organic grains at 31 Dec 2026. The initial purchase price was $150,000, and inward transport freight costs were $12,000. Administrative storage monitoring cost was $5,000. Due to minor insect contamination, the market price has slumped. The competitive raw grain price is now $140,000, and Solomon must pay standard transport of $8,000 and certification commissions of $6,000 to complete the agricultural sale.",
        analysis: "1. Eligible Capitalized Cost: Purchase Cost ($150,000) + Inward Freight ($12,000) = $162,000. Storage monitoring ($5,000) is a storage cost and must be expensed as a period overhead.\n2. Compute Net Realizable Value (NRV): Estimated Selling Price ($140,000) less Costs to Sell (Freight $8,000 + Commissions $6,000) = $126,000.\n3. Lower of Cost ($162,000) and NRV ($126,000) yields inventory value of $126,000. A write-down of $36,000 ($162K - $126K) must be recorded.",
        journalEntries: [
          {
            description: "To adjust inventory balances to lower of cost and net realizable value:",
            debit: "Cost of Goods Sold (Inventory Write-down Expense)",
            credit: "Inventory Accounts Asset",
            amount: "$36,000"
          }
        ]
      }
    ]
  },
  {
    id: "IAS-12",
    code: "IAS 12",
    title: "Income Taxes",
    effectiveDate: "1 January 1998",
    summary: "Sets out accounting treatment for income taxes, including current tax liabilities and deferred tax consequences of temporary differences between carrying amounts of assets/liabilities and their tax base.",
    keyConcepts: [
      "Tax base of assets and liabilities",
      "Deductible vs Taxable Temporary Differences",
      "Deferred Tax Asset (DTA) recognition criteria (probable future taxable profits)",
      "Deferred Tax Liability (DTL) mandatory recognition",
      "Tax rate changes and impact calculation on existing items"
    ],
    complianceChecklist: [
      "Have all carrying amounts of balance sheet assets been compared against their statutory tax bases?",
      "Has a deferred tax asset been restricted to the extent that future taxable profit is probable against which losses can be offset?",
      "Has deferred tax been measured using the enacted or substantively enacted tax rates of the future offset periods?",
      "Are deferred tax assets and liabilities correctly presented as non-current in progress reports?",
      "Has deferred tax related to items recognized in OCI or directly in Equity been charged to OCI/Equity respectively?"
    ],
    detailedOverview: "IAS 12 prescribes the accounting treatment for income taxes. It requires an entity to recognize the tax consequences of transactions in the same way that it accounts for the transactions themselves, either in profit or loss, other comprehensive income, or directly in equity.",
    specificProvisions: [
      {
        title: "Current Tax Assets and Liabilities",
        requirements: "Measured at the amount expected to be paid to (recovered from) the taxation authorities, using the tax rates and tax laws that have been enacted or substantively enacted by the end of the reporting period."
      },
      {
        title: "Deferred Tax Liabilities and Temporary Differences",
        requirements: "Deferred tax liabilities must be recognized for all taxable temporary differences (carrying amount exceeds tax base for assets; tax base exceeds carrying amount for liabilities), unless they arise from: (a) initial recognition of goodwill or (b) initial recognition of an asset/liability in a transaction that is not a business combination and affects neither accounting nor taxable profit."
      },
      {
        title: "Deferred Tax Assets and Tax Losses (IAS 12.24)",
        requirements: "A deferred tax asset is recognized for deductible temporary differences, unused tax losses, and unused tax credits to the extent that it is probable that future taxable profits will be available against which they can be utilized."
      }
    ],
    interpretationsText: "SIC-25 Income Taxes — Changes in the Tax Status of an Entity or its Shareholders. IFRIC 23 Uncertainty over Income Tax Treatments.",
    changesEffectiveThisYear: "Amendments to IAS 12: Pillar Two Model Rules (effective 1 January 2023) introduce a temporary mandatory exception to acknowledging and disclosing deferred tax assets/liabilities from OECD Pillar Two rules.",
    pendingChanges: "International Tax Reform—Pillar Two disclosures and monitoring are ongoing standard-setting watch points.",
    sourceParagraphs: [
      {
        id: "ias12-p15",
        citation: "IAS 12 Paragraph 15",
        title: "Deferred Tax Liability Recognition",
        description: "A deferred tax liability shall be recognised for all taxable temporary differences, except to the extent that the deferred tax liability arises from..."
      },
      {
        id: "ias12-p24",
        citation: "IAS 12 Paragraph 24",
        title: "Deferred Tax Asset Recognition",
        description: "A deferred tax asset shall be recognised for all deductible temporary differences to the extent that it is probable that taxable profit will be available against which the deductible temporary difference can be utilised."
      }
    ],
    caseStudies: [
      {
        id: "cs-ias12-1",
        title: "Equipment Depreciation Tax Mismatch",
        issue: "How is a deferred tax liability computed when tax tax schedules allow immediate deduction whereas accounting schedules require straight-line depreciation?",
        scenario: "Hyperion Inc purchases a heavy mainframe server on Jan 1, 2026 for $100,000. For accounting purposes, Hyperion depreciates it straight-line over 5 years ($20,000 per year) to zero residual. Under local tax code, Hyperion is allowed 100% immediate capital bonus deduction in Year 1. The statutory corporation tax tax rate is 25%. No other differences exist.",
        analysis: "At December 31, 2026:\n- Accounting Carrying Value (Net Book Value) = $100,000 - $20,000 = $80,000.\n- Tax Base of Server = $0 (since local tax code allowed immediate 100% deduction).\n- Temporary Tax Difference = Carrying Value ($80,000) minus Tax Base ($0) = $80,000.\n- This is a Taxable Temporary Difference because future depreciation of $80,000 is not tax-deductible (thus cash income tax outflows will be proportionally higher).\n- Deferred Tax Liability (DTL) = $80,000 * 25% statutory rate = $20,000 DTL at year-end.",
        journalEntries: [
          {
            description: "To recognize the deferred tax consequence of the temporary asset depreciation mismatch at year-end:",
            debit: "Deferred Tax Expense (Statement of Profit or Loss)",
            credit: "Deferred Tax Liability (Non-Current Balance Sheet Liability)",
            amount: "$20,000"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-18",
    code: "IFRS 18",
    title: "Presentation and Disclosure in Financial Statements",
    effectiveDate: "1 January 2027 (replaces IAS 1)",
    summary: "Replaces IAS 1 Presentation of Financial Statements. Its primary goal is to improve how entities present financial performance, introducing structured profit-and-loss categories (Operating, Investing, Financing, Income Tax, Discontinued), mandating standard subtotals like 'Operating Profit', and regulating non-GAAP Management-defined Performance Measures (MPMs).",
    keyConcepts: [
      "Five Categories of Profit or Loss (Operating, Investing, Financing, Income Tax, Discontinued)",
      "Three Defined Subtotals (Operating Profit, Profit Before Financing and Tax, Profit or Loss)",
      "Management-defined Performance Measures (MPMs) Disclosure Rigor",
      "Principles of Aggregation and Disaggregation (preventing generic 'other' lines)",
      "Integration of Notes and Primary Statements"
    ],
    complianceChecklist: [
      "Are income and expenses classified into one of the five required operating/investing/financing categories?",
      "Has 'Operating Profit' been clearly presented as a required subtotal in the Income Statement?",
      "Are any Management-defined Performance Measures (MPMs) disclosed in a dedicated note with reconciliations?",
      "Have material items been properly disaggregated instead of being consolidated into generalized 'other expenses'?",
      "Are expenses in the operating category presented by nature, by function, or a combination that provides the most useful information?"
    ],
    sourceParagraphs: [
      {
        id: "ifrs18-p47",
        citation: "IFRS 18 Paragraph 47",
        title: "Classification of Profit or Loss Items",
        description: "An entity shall classify income and expenses in the statement of profit or loss into five categories: operating, investing, financing, income taxes, and discontinued operations, to provide more comparable and useful information."
      },
      {
        id: "ifrs18-p65",
        citation: "IFRS 18 Paragraph 65",
        title: "Required Subtotals",
        description: "An entity shall present structured subtotals in the statement of profit or loss, including: (a) operating profit; (b) operating profit and income and expenses from integral joint ventures and associates (if present); and (c) profit before financing and income taxes."
      },
      {
        id: "ifrs18-p110",
        citation: "IFRS 18 Paragraph 110",
        title: "Management-defined Performance Measures (MPMs)",
        description: "An entity shall disclose management-defined performance measures in a single note. This note must state why the measure is useful, reconcile the measure to the most directly comparable subtotal required by IFRS, and present the tax and non-controlling interest impacts."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs18-1",
        title: "Reclassifying Statement of Profit or Loss under IFRS 18",
        issue: "How should a corporation restructure its IAS 1 layout into the five distinct standard categories of IFRS 18, and calculate 'Operating Profit'?",
        scenario: "Apex Global has an old IAS 1 Statement of Profit or Loss for the year ended 31 Dec 2026. The revenues are $1,000,000. Cost of sales is $600,000. Administrative expenses are $120,000. Under IAS 1, Apex included other items in a single list: (1) Interest expense on loans ($30,000), (2) Share of profit of associates ($40,000), (3) Dividend income from minor stock holdings ($15,000), (4) Fair value loss on short-term investments ($10,000), and (5) Bank fees on general bank accounts ($5,000). Total profit was recorded as $290,000. Apex needs to restructure this to comply with IFRS 18.",
        analysis: "Under IFRS 18, we must divide items into categories:\n1. Operating Category: Revenue ($1,000,000), Cost of Sales (-$600,000), Administrative Expenses (-$120,000), and Bank fees (-$5,000). These bank transaction costs relate to general operations. Operating Profit = $1,000,000 - $600,000 - $120,000 - $5,000 = $275,000.\n2. Investing Category: Shares of profit of associates ($40,000), Dividend income ($15,000), and Fair value loss on investments (-$10,000). Total Investing Income = $45,000.\n   - Net Operating + Investing Subtotal = $275,000 + $45,000 = $320,000 (which is Profit before Financing & Tax).\n3. Financing Category: Interest expense on loans (-$30,000).\n4. This yields Net Profit before Tax = $320,000 - $30,000 = $290,000.\nThis new layout clearly isolates Operating Profit ($275,000) from investment returns and financing decisions.",
        journalEntries: [
          {
            description: "To reclassify general interest expense from Operating/General admin into its dedicated Financing Category:",
            debit: "Financing Expense (P&L - Financing Category)",
            credit: "Finance Interest Expense (Contra-liability/Cash paid)",
            amount: "$30,000"
          },
          {
            description: "To reclassify dividend receipts and fair value asset moves from Operating into the Investing Category:",
            debit: "Investment Returns / Dividend Income (Investing Category)",
            credit: "Other Miscellaneous Operating Income",
            amount: "$5,000 (Net reclass)"
          }
        ]
      }
    ]
  },
  {
    id: "Conceptual-Framework",
    code: "Conceptual Framework",
    title: "Conceptual Framework for Financial Reporting",
    effectiveDate: "March 2018",
    summary: "Sets out the fundamental concepts of financial reporting, guiding the IASB in developing standards, and helping preparers develop consistent accounting policies when no standard applies, or when a standard allows a choice. Covers qualitative characteristics, elements definition, measurement, and presentation.",
    keyConcepts: [
      "Objective of General Purpose Financial Reporting (Decision-usefulness)",
      "Fundamental Qualitative Characteristics: Relevance & Faithful Representation",
      "Enhancing Characteristics (Comparability, Verifiability, Timeliness, Understandability)",
      "Revised Definitions of Asset (Present economic resource controlled) and Liability (Present obligation to transfer resource)",
      "Derecognition and Recognition Probability Threshold update",
      "Measurement Bases: Historical Cost vs. Current Value (Fair Value, VIU, Current Cost)"
    ],
    complianceChecklist: [
      "Does the financial transaction information meet the fundamental characteristics of Relevance and Faithful Representation?",
      "For any recognized asset, is there control over a present economic resource with economic benefits potential?",
      "Is there a present obligation to transfer economic resources (satisfying direct liability definition) resulting from a past event?",
      "Has derecognition been assessed to properly reflect any assets/liabilities retained after transaction completion?",
      "Has an appropriate measurement basis (historical cost vs fair value vs current value) been selected to provide maximum decision-useful information?"
    ],
    sourceParagraphs: [
      {
        id: "cf-p1.2",
        citation: "Conceptual Framework Paragraph 1.2",
        title: "Objective of Financial Reporting",
        description: "The objective of general purpose financial reporting is to provide financial information about the reporting entity that is useful to existing and potential investors, lenders and other creditors in making decisions relating to providing resources to the entity."
      },
      {
        id: "cf-p2.4",
        citation: "Conceptual Framework Paragraph 2.4",
        title: "Qualitative Characteristics of Useful Information",
        description: "If financial information is to be useful, it must be relevant and faithfully represent what it purports to represent. The usefulness of financial information is enhanced if it is comparable, verifiable, timely and understandable."
      },
      {
        id: "cf-p4.3",
        citation: "Conceptual Framework Paragraph 4.3",
        title: "Definition of an Asset",
        description: "An asset is a present economic resource controlled by the entity as a result of past events. An economic resource is a right that has the potential to produce economic benefits."
      },
      {
        id: "cf-p4.26",
        citation: "Conceptual Framework Paragraph 4.26",
        title: "Definition of a Liability",
        description: "A liability is a present obligation of the entity to transfer an economic resource as a result of past events. For a liability to exist, three criteria must be met: the entity has an obligation; the obligation is to transfer an economic resource; and the obligation is a present obligation that exists as a result of past events."
      }
    ],
    caseStudies: [
      {
        id: "cs-cf-1",
        title: "Evaluating Asset Control Under the Conceptual Framework",
        issue: "Does an entity meet the asset recognition criteria for research outputs or access licences when legal title is not yet finalised?",
        scenario: "Solas Energies spends $200,000 on deep seismic exploratory research files under a joint municipal agreement. Solas has unique proprietary access to these geological files for 5 years and can sell or license this data to other researchers. However, the municipal government retains ultimate legal ownership of the physical land and raw telemetry. Solas wants to capitalize the $200,000 as an intangible asset since they control the commercial application of the data.",
        analysis: "Under the Conceptual Framework (CF 4.3), an asset does not require legal ownership of a physical medium—it requires control over an economic resource (a right that has potential to produce economic benefits). Solas holds the exclusive commercial right to use and license the telemetry files for 5 years, restricted from competitors, meaning Solas controls the access and benefits. Therefore, a right-of-use or intangible exploratory asset is present under the definitions. Solas must now reference specific standards (such as IAS 38 or IFRS 6) to confirm whether the cost meets standard-specific capitalization criteria, but conceptually the definition of an asset is satisfied.",
        journalEntries: [
          {
            description: "To record the acquisition of the scientific exploratory access rights asset:",
            debit: "Intangible Exploration & Access Assets",
            credit: "Cash / Accounts Payable",
            amount: "$200,000"
          }
        ]
      }
    ]
  },
  {
    id: "IAS-10",
    code: "IAS 10",
    title: "Events after the Reporting Period",
    effectiveDate: "1 January 2005",
    summary: "Prescribes when an entity should adjust its financial statements for events after the reporting period (adjusting events) and what disclosures should be given about events after the reporting period (non-adjusting events).",
    keyConcepts: [
      "Adjusting Events: evidence of conditions existing at the end of the reporting period",
      "Non-adjusting Events: indicative of conditions that arose after the reporting period",
      "Going concern assessment triggered by severe post-balance-sheet deterioration",
      "Dividend declarations post-period-end (disclosed but not recorded as liability)"
    ],
    complianceChecklist: [
      "Has a systematic review of material events between the balance sheet date and authorization date been completed?",
      "Were any debtor bankruptcies after year-end evaluated to see if the impairment condition existed at year-end?",
      "Have lawsuits settled after the reporting period been processed as adjusting events to alter provisions?",
      "Are all material non-adjusting events (e.g., major business mergers or natural disasters) disclosed with financial estimates?",
      "Is the exact date when the financial statements were authorized for issue properly disclosed?"
    ],
    detailedOverview: "IAS 10 prescribes when an entity should adjust its financial statements for events after the reporting period and the disclosures that an entity should give about the date when the financial statements were authorized for issue and about events after the reporting period.",
    specificProvisions: [
      {
        title: "Adjusting Events (IAS 10.8)",
        requirements: "An entity shall adjust the amounts recognized in its financial statements to reflect adjusting events after the reporting period. Examples: settlement of a court case that confirms a present obligation existed at year-end; receipt of info indicating that an asset was impaired at year-end (e.g., bankruptcy of a customer; discovery of fraud or errors)."
      },
      {
        title: "Non-Adjusting Events (IAS 10.10)",
        requirements: "An entity shall not adjust the amounts recognized in its financial statements to reflect non-adjusting events after the reporting period. Examples: a decline in market value of investments between year-end and authorization date; entering into major business combinations or disposing of a major subsidiary; destruction of a major production plant by fire."
      },
      {
        title: "Going Concern (IAS 10.14)",
        requirements: "An entity shall not prepare its financial statements on a going concern basis if management determines after the reporting period either that it intends to liquidate the entity or to cease trading, or that it has no realistic alternative but to do so."
      }
    ],
    interpretationsText: "None active.",
    changesEffectiveThisYear: "None.",
    pendingChanges: "None indicated at 31 August 2025.",
    sourceParagraphs: [
      {
        id: "ias10-p8",
        citation: "IAS 10 Paragraph 8",
        title: "Adjusting Events After the Reporting Period",
        description: "An entity shall adjust the amounts recognized in its financial statements to reflect adjusting events after the reporting period."
      },
      {
        id: "ias10-p10",
        citation: "IAS 10 Paragraph 10",
        title: "Non-adjusting Events After the Reporting Period",
        description: "An entity shall not adjust the amounts recognized in its financial statements to reflect non-adjusting events after the reporting period."
      },
      {
        id: "ias10-p21",
        citation: "IAS 10 Paragraph 21",
        title: "Disclosing Non-adjusting Events",
        description: "If non-adjusting events after the reporting period are material, non-disclosure could influence the economic decisions that users make on the basis of the financial statements."
      }
    ],
    caseStudies: [
      {
        id: "cs-ias10-1",
        title: "Major Customer Insolvency Post reporting Date",
        issue: "Should a major customer bankruptcy declared on 15 February (prior to financial statement authorization on 10 March) adjust receivables at 31 December?",
        scenario: "Solas Energies holds an outstanding debit invoice of $150,000 at 31 December 2025. The customer suffered severe economic damage from a local crisis during autumn 2025 and officially declared insolvency on 15 February 2026.",
        analysis: "Since the insolvency provides additional evidence of conditions (insolvency risk) that already existed at 31 December, this is an adjusting event under IAS 10.8. Solas must write down the receivable balance.",
        journalEntries: [
          {
            description: "To adjust receivables for post year-end customer insolvency:",
            debit: "Impairment Loss on Trade Receivables (P&L)",
            credit: "Allowance for Doubtful Accounts (Contra-asset)",
            amount: "$150,050"
          }
        ]
      }
    ]
  },
  {
    id: "IAS-19",
    code: "IAS 19",
    title: "Employee Benefits",
    effectiveDate: "1 January 2013",
    summary: "Sets out the accounting and disclosures for employee benefits, requiring immediate recognition of liability for services rendered and separating defined benefit plan changes into P&L and other comprehensive income (OCI).",
    keyConcepts: [
      "Short-term employee benefits (salaries, annual leave, bonuses) recognized as helper expenses",
      "Defined benefit plans require actuarial valuation via Projected Unit Credit Method",
      "Immediate recognition of service costs and net interest in Profit or Loss",
      "Remeasurements of defined benefit liabilities/assets recognized inside OCI"
    ],
    complianceChecklist: [
      "Are short-term compensated absences (accumulating leave) recognized when employees render service?",
      "Have defined benefit obligations been measured by qualified actuaries using standard pension models?",
      "Is the net interest cost on the pension surplus or deficit recognized in finance costs in P&L?",
      "Were all actuarial remeasurement gains and losses recognized immediately in OCI and never recycled?",
      "Are all major actuarial assumptions (discount rate, salary trends, mortality) disclosed?"
    ],
    detailedOverview: "IAS 19 prescribes the accounting and disclosure for all types of employee benefits (except those to which IFRS 2 Share-based Payment applies). The general principle is that the cost of providing employee benefits should be recognized in the period in which the benefit is earned by the employee, rather than when it is paid or payable.",
    specificProvisions: [
      {
        title: "Short-Term and Long-Term Employee Benefits",
        requirements: "Short-term benefits (salaries, annual leave, sick leave, bonuses) are recognized as an expense when employees render service. Other long-term benefits (long-service leave) are measured using the Projected Unit Credit Method, but all changes in carrying value are recognized in P&L."
      },
      {
        title: "Defined Benefit Plans - Projected Unit Credit Method",
        requirements: "Requires an actuarial technique (the Projected Unit Credit Method) to make a reliable estimate of the ultimate cost to the entity of the benefit. Obligations must be discounted using high-quality corporate bond yields or government bond rates."
      },
      {
        title: "Presentation of Benefits cost components (IAS 19.120)",
        requirements: "(a) Service cost (current, past, curtailment) in profit or loss; (b) net interest on net defined benefit liability (asset) in profit or loss; (c) remeasurements (actuarial gains/losses, return on plan assets excluding net interest) in OCI (not reclassifiable subsequently to P&L)."
      }
    ],
    interpretationsText: "IFRIC 14 IAS 19 — The Limit on a Defined Benefit Asset, Minimum Funding Requirements and their Interaction.",
    changesEffectiveThisYear: "None.",
    pendingChanges: "Ongoing research by IASB on pension benefits with promising features.",
    sourceParagraphs: [
      {
        id: "ias19-p57",
        citation: "IAS 19 Paragraph 57",
        title: "Actuarial Valuation for Defined Benefit Plans",
        description: "An entity shall use the Projected Unit Credit Method to determine the present value of its defined benefit obligations and the related current service cost."
      },
      {
        id: "ias19-p120",
        citation: "IAS 19 Paragraph 120",
        title: "Reporting Benefit Cost Components",
        description: "An entity shall recognize: (a) service cost in profit or loss; (b) net interest on the net defined benefit liability (asset) in profit or loss; and (c) remeasurements of the net defined benefit liability (asset) in other comprehensive income."
      }
    ],
    caseStudies: [
      {
        id: "cs-ias19-1",
        title: "Pension Fund Actuarial Re-valuation Adjustments",
        issue: "How should an entity allocate service costs, interest costs, and actuarial remeasurement losses at reporting date?",
        scenario: "Apex Employee Benefit plan has a current service cost of $120,000, net interest expense of $10,000, and a remeasurement actuarial valuation loss of $35,000.",
        analysis: "Under IAS 19, the current service cost and net interest cost are recognized in Profit or Loss as pension operational expenses. The actuarial loss of $35,000 must be recognized in OCI and accumulated in equity.",
        journalEntries: [
          {
            description: "To charge annual service and finance pension costs to Profit or Loss:",
            debit: "Employee Benefit Service Costs ($120k) & Pension Interest Cost ($10k)",
            credit: "Net Defined Benefit Pension liability",
            amount: "$130,000"
          },
          {
            description: "To recognize actuarial loss in Other Comprehensive Income (OCI):",
            debit: "Actuarial Remeasurement Loss (OCI - Equity)",
            credit: "Net Defined Benefit Pension liability",
            amount: "$35,000"
          }
        ]
      }
    ]
  },
  {
    id: "IAS-23",
    code: "IAS 23",
    title: "Borrowing Costs",
    effectiveDate: "1 January 2009",
    summary: "Requires borrowing costs directly attributable to the acquisition, construction, or production of a qualifying asset (one taking substantial preparation time) to be capitalized as part of the asset's cost.",
    keyConcepts: [
      "Mandatory capitalization of borrowing costs on qualifying assets",
      "Qualifying asset definition (substantial period of time to get ready, typically >12 months)",
      "General borrowings capitalize using weighted capitalization rate",
      "Offset temp investment interest gains against capitalized expense"
    ],
    complianceChecklist: [
      "Does the asset require a substantial period of time to prepare for its intended use or sale?",
      "Are capitalized borrowing costs restricted strictly to periods of active physical development?",
      "Have capitalizations been suspended during extended inactive construction periods?",
      "Has capital interest capitalization ceased when the asset is substantially complete?",
      "Has temporary investment income from specific borrowings been subtracted from capitalized costs?"
    ],
    sourceParagraphs: [
      {
        id: "ias23-p8",
        citation: "IAS 23 Paragraph 8",
        title: "Mandatory Interest Capitalization",
        description: "An entity shall capitalize borrowing costs that are directly attributable to the acquisition, construction or production of a qualifying asset as part of the cost of that asset. An entity shall recognize other borrowing costs as an expense in the period in which it incurs them."
      },
      {
        id: "ias23-p12",
        citation: "IAS 23 Paragraph 12",
        title: "Specific Borrowing Offsets",
        description: "To the extent that an entity borrows funds specifically for the purpose of obtaining a qualifying asset, the entity shall determine the amount of borrowing costs eligible for capitalization as the actual borrowing costs incurred on that borrowing during the period less any investment income on the temporary investment of those borrowings."
      }
    ],
    caseStudies: [
      {
        id: "cs-ias23-1",
        title: "Borrowing Capitalization with Cash Placement Offsets",
        issue: "How is capitalization calculated when surplus specific loan proceeds are deposited prior to vendor cash calls?",
        scenario: "Apex Builders borrowed $2,000,000 specifically at 8% annual yield to construct a warehouse. Development started Jan 1, lasting 15 months. Temporary cash deposits yielded $16,000 of interest during initial construction lags.",
        analysis: "The total gross interest incurred during the year is $160,000. Under IAS 23.12, the temporary yield of $16,000 is netted off, reducing capitalized asset cost to $144,000.",
        journalEntries: [
          {
            description: "To record net borrowing interest capitalized as asset WIP:",
            debit: "Warehouse Property Development WIP ($144k) & Cash/Interest Receivable ($16k)",
            credit: "Cash/Interest Payable (total gross financing)",
            amount: "$160,000"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-2",
    code: "IFRS 2",
    title: "Share-based Payment",
    effectiveDate: "1 January 2005",
    summary: "Governs the recognition of transactions where an entity receives goods or services in exchange for equity instruments (equity-settled) or liabilities based on its share valuation (cash-settled).",
    keyConcepts: [
      "Equity-settled vs. cash-settled payment paths",
      "Measurement at fair value of the equity instruments granted at grant-date",
      "Employee services expense mapped over the specific vesting period",
      "Remeasuring cash-settled liabilities at the close of every reporting date"
    ],
    complianceChecklist: [
      "Are all service incentives (options, free shares) measured at their grant-date fair values?",
      "Is the total predicted cost spread straight-line across the vesting timeframe?",
      "Has the headcount vesting probability been adjusted over time to reflect true staff attrition?",
      "Are cash-settled plans remeasured to fair value at each reporting date until settlement?",
      "Are valuation pricing models (e.g. Black-Scholes) and inputs disclosed in the notes?"
    ],
    sourceParagraphs: [
      {
        id: "ifrs2-p7",
        citation: "IFRS 2 Paragraph 7",
        title: "Recognition of Share Based Payments",
        description: "An entity shall recognize the goods or services received or acquired in a share-based payment transaction when it obtains the goods or receives the services. The entity shall recognize a corresponding increase in equity if the goods or services were received in an equity-settled share-based payment transaction, or a liability if the goods or services were acquired in a cash-settled share-based payment transaction."
      },
      {
        id: "ifrs2-p10",
        citation: "IFRS 2 Paragraph 10",
        title: "Equity-Settled Fair Value Principles",
        description: "For equity-settled share-based payment transactions, the entity shall measure the goods or services received, and the corresponding increase in equity, directly, at the fair value of the goods or services received, unless that fair value cannot be estimated reliably. If the entity cannot estimate reliably the fair value of the goods or services received, the entity shall measure their value, and the corresponding increase in equity, indirectly, by reference to the fair value of the equity instruments granted."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs2-1",
        title: "Vesting Schedule Stock Option Expenses",
        issue: "How is the periodic expense determined for employee options vesting over 3 years subject to service conditions?",
        scenario: "Sovereign Tech allocates 100,000 employee option grants with a grant-date fair value of $6.00. The plan vests over 3 years. Over Year 1, historical attrition suggests 95,000 options will eventually vest.",
        analysis: "The total forecasted cost is 95,000 * $6 = $570,000. Year 1 expense is one-third of the total cost: $190,000, mapped to Equity Reserves.",
        journalEntries: [
          {
            description: "To book annual vesting expense for employee stock options:",
            debit: "Share Option Employee Compensation Expense (P&L)",
            credit: "Share Option Reserve (Equity Component)",
            amount: "$190,000"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-5",
    code: "IFRS 5",
    title: "Non-current Assets Held for Sale and Discontinued Operations",
    effectiveDate: "1 January 2005",
    summary: "Sets rules to classify non-current assets as 'held for sale' when their cost is mostly recovered from a sale rather than usage. They are measured at the lower of carrying cost and fair value less costs to sell, and depreciation must cease.",
    keyConcepts: [
      "Held for Sale strict criteria (available now, sale highly probable, finish inside 12 months)",
      "Measurement rules: lower of carrying amount and fair value less cost to sell",
      "Immediate pause on depreciation upon reclassifying the target asset",
      "Discontinued operations isolated as one final net-of-tax line in the P&L"
    ],
    complianceChecklist: [
      "Is the asset ready for immediate sale in its current state?",
      "Are corporate managers actively committed to the plan and marketing the asset to buyers?",
      "Is the transaction highly probable to conclude within one continuous year?",
      "Has all depreciation and amortization stopped since reclassification date?",
      "Are discontinued operations totals shown on a separate single line of the Income Statement?"
    ],
    sourceParagraphs: [
      {
        id: "ifrs5-p6",
        citation: "IFRS 5 Paragraph 6",
        title: "Classification of Held for Sale Assets",
        description: "An entity shall classify a non-current asset (or disposal group) as held for sale if its carrying amount will be recovered principally through a sale transaction rather than through continuing use."
      },
      {
        id: "ifrs5-p15",
        citation: "IFRS 5 Paragraph 15",
        title: "Lower of carrying value or net sale proceeds",
        description: "An entity shall measure a non-current asset (or disposal group) classified as held for sale at the lower of its carrying amount and fair value less costs to sell."
      },
      {
        id: "ifrs5-p25",
        citation: "IFRS 5 Paragraph 25",
        title: "Cessation of Depreciation",
        description: "An entity shall not depreciate (or amortize) a non-current asset while it is classified as held for sale or while it is part of a disposal group classified as held for sale."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs5-1",
        title: "Reclassifying Regional Property Assets",
        issue: "How is a commercial warehouse building written down and reclassified upon being placed on the marketplace?",
        scenario: "Global Logistics places its North branch depot on the open market. Carrying value is $550,000. Market appraisals list sale values at $500,000, with expected broker charges of $25,000.",
        analysis: "Under IFRS 5, the warehouse must be measured at the lower of carrying book ($550,000) or net sale value ($475,000). A $75,000 write-down must be recognized in P&L, depreciation ceases, and the net asset moves to current assets.",
        journalEntries: [
          {
            description: "To reclassify building asset and write down carrying cost to net realizable value:",
            debit: "Non-current Assets Held for Sale (Current Assets) ($475k) & Impairment Expense ($75k)",
            credit: "Property, Plant & Equipment - Buildings (Non-current)",
            amount: "$550,000"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-7",
    code: "IFRS 7",
    title: "Financial Instruments: Disclosures",
    effectiveDate: "1 January 2007",
    summary: "Requires organizations to reveal qualitative and quantitative metrics on their financial risks (credit, liquidity, and market risks) and the significance of instruments to corporate cash flow performance.",
    keyConcepts: [
      "Grouping disclosures by distinct classes of financial instruments",
      "Qualitative disclosures detailing financial risk management frameworks",
      "Quantitative reports showing trade debtor aging, credit risks, and liquidity buckets",
      "Maturity analysis indicating dates when liability payouts are legally due"
    ],
    complianceChecklist: [
      "Are all disclosures structured cleanly by instrument classes instead of loose ledger sheets?",
      "Does the text outline risk controls, hedging choices, and board policy limits?",
      "Is an expected credit loss (ECL) credit profile presented on trade receivables?",
      "Has a contractual undiscounted maturity table been structured for liabilities?",
      "Have market risk sensitivity tests (interest rate, forex shifts) been detailed?"
    ],
    sourceParagraphs: [
      {
        id: "ifrs7-p31",
        citation: "IFRS 7 Paragraph 31",
        title: "Risk Disclosures Objective",
        description: "An entity shall disclose information that enables users of its financial statements to evaluate the nature and extent of risks arising from financial instruments to which the entity is exposed at the end of the reporting period."
      },
      {
        id: "ifrs7-p39",
        citation: "IFRS 7 Paragraph 39",
        title: "Contractual Liquidity Schedules",
        description: "An entity shall disclose: (a) a maturity analysis for non-derivative financial liabilities (including issued financial guarantee contracts) that shows the remaining contractual maturities."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs7-1",
        title: "Structuring the Financial Risk Exposure disclosures",
        issue: "Does an entity face financial ledger changes when outlining liquidity limits under IFRS 7 rules?",
        scenario: "Apex Global holds $800,000 in long-term trade financial notes alongside $300,000 in receivables. Their auditors request structured exposure profiles.",
        analysis: "IFRS 7 is purely a disclosure-driven standard. No ledger booking adjustments occur, but the entity is non-compliant unless they attach specific tables: (1) Maturity schedules, (2) Credit quality analysis, and (3) Currency sensitivity grids.",
        journalEntries: [
          {
            description: "No balance sheet double entry needed for disclosure standards:",
            debit: "Trade Finance Risks / Contractual Note Annexes",
            credit: "Disclosure Compliant Supplementary Tables",
            amount: "$0"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-10",
    code: "IFRS 10",
    title: "Consolidated Financial Statements",
    effectiveDate: "1 January 2013",
    summary: "Establishes a single consolidation model based on the concept of 'control' to decide whether a parent company must consolidate underlying investees into its reporting package.",
    keyConcepts: [
      "The Three elements of Control: Power, Variable Returns, and Linkage",
      "Corporate parent acting as principal versus as an intermediary agent",
      "Mandatory consolidation of controlled subsidiaries into group folders",
      "Full elimination of intra-group balances, intercompany trading, and unrealized profit margins"
    ],
    complianceChecklist: [
      "Does the parent hold current powers to direct the most critical relevant activities?",
      "Does the parent maintain rights and exposures to variable cash flows and returns?",
      "Can the parent use its power to influence variable investor returns?",
      "Have all intercompany bills, internal inventory flows, and margins been deleted?",
      "Is the Non-controlling Interest (NCI) shown as a distinct equity segment?"
    ],
    sourceParagraphs: [
      {
        id: "ifrs10-p5",
        citation: "IFRS 10 Paragraph 5",
        title: "The Single Basis of Control",
        description: "An investor, regardless of the nature of its involvement with an entity (the investee), shall determine whether it is an investor that controls the investee. An investor controls an investee when it is exposed, or has rights, to variable returns from its involvement with the investee and has the ability to affect those returns through its power over the investee."
      },
      {
        id: "ifrs10-p18",
        citation: "IFRS 10 Paragraph 18",
        title: "Standard Consolidation Procedures",
        description: "Consolidated financial statements: (a) combine like items of assets, liabilities, equity, income, expenses and cash flows of the parent with those of its subsidiaries; (b) offset (eliminate) the carrying amount of the parent's investment in each subsidiary and the parent's portion of equity of each subsidiary; (c) eliminate in full intragroup assets and liabilities, equity, income, expenses..."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs10-1",
        title: "Eliminating Intra-Group Stock Markup Profit",
        issue: "How is an internal stock transfer of $100,000 containing a $20,000 profit margin accounted for at year-end?",
        scenario: "Holdings Co. sold raw stock to Subsidiary Co. for $100,000. The sale included a $20,000 profit markup. At year-end, Subsidiary Co. still holds the entire stock inside its warehouse.",
        analysis: "Under IFRS 10, the group represents a single economic unit. The internal transfer is eliminated. The $20,000 unrealized profit must be removed to bring group stock balances back to original cost.",
        journalEntries: [
          {
            description: "To eliminate intercompany sales and unrealized inventory margin:",
            debit: "Group Revenue (P&L Elimination) ($100k)",
            credit: "Group Cost of Goods Sold (P&L) ($80k) & Stock Inventory Asset (Balance Sheet) ($20k)",
            amount: "$100,000"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-11",
    code: "IFRS 11",
    title: "Joint Arrangements",
    effectiveDate: "1 January 2013",
    summary: "Regulates financial reporting for groups sharing joint control of a business. It separates arrangements into Joint Operations (rights to assets/liabilities) and Joint Ventures (rights to net asset equity).",
    keyConcepts: [
      "Contractual Joint Control requiring unanimous consensus on relevant acts",
      "Joint Operations: recognized on a proportional asset and liability basis",
      "Joint Ventures: recognized on an equity investment basis under IAS 28",
      "The legal framework of vehicle structure does not override actual contract terms"
    ],
    complianceChecklist: [
      "Is contract unanimous agreement required for key strategic financial maneuvers?",
      "Are operators directly liable for debts of the joint vehicle (Joint Operation)?",
      "Do partners only have rights to residual pool values (Joint Venture)?",
      "Are Joint Ventures accounted for using the standard Equity Method?",
      "Are Join Operation asset shares and costs tracked proportionally?"
    ],
    sourceParagraphs: [
      {
        id: "ifrs11-p4",
        citation: "IFRS 11 Paragraph 4",
        title: "Defining Joint Control",
        description: "Joint control is the contractually agreed sharing of control of an arrangement, which exists only when decisions about the relevant activities require the unanimous consent of the parties sharing control."
      },
      {
        id: "ifrs11-p15",
        citation: "IFRS 11 Paragraph 15",
        title: "Joint Operation Accounting",
        description: "A joint operation is a joint arrangement whereby the parties that have joint control of the arrangement have rights to the assets, and obligations for the liabilities, relating to the arrangement. Those parties are called joint operators."
      },
      {
        id: "ifrs11-p16",
        citation: "IFRS 11 Paragraph 16",
        title: "Joint Venture Accounting",
        description: "A joint venture is a joint arrangement whereby the parties that have joint control of the arrangement have rights to the net assets of the arrangement. Those parties are called joint venturers."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs11-1",
        title: "Mapping Regional Pipelines as a Joint Operation",
        issue: "How does a firm book its 40% joint construction interest into its financial statements?",
        scenario: "Apex Energy Group holds a 40% block of the Joint Operation pipeline syndicate 'Apex Pipelines'. General pipeline machinery additions cost $500,000, and repair bills cost $90,000.",
        analysis: "Under IFRS 11, joint operators book their exact share directly: 40% of the machinery asset ($200,000) and 40% of the maintenance costs ($36,000). Group equity accounting is not used.",
        journalEntries: [
          {
            description: "To book direct proportional share of joint operation assets and operating bills:",
            debit: "Pipeline Infrastructure Asset (PP&E Share) ($200k) & Pipeline Repair Outlay (P&L) ($36k)",
            credit: "Cash / Accounts Payable",
            amount: "$236,000"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-12",
    code: "IFRS 12",
    title: "Disclosure of Interests in Other Entities",
    effectiveDate: "1 January 2013",
    summary: "Sets out high-level disclosures for interests held in subsidiaries, joint ventures, associates, and structured vehicles to describe group holding profiles and risk exposures.",
    keyConcepts: [
      "Judgments in determining control limits and power splits",
      "Listing subsidiary cash holding restrictions and NCI percentage allocations",
      "Summarizing investment balance sheets and financial flows for associates",
      "Structured entities information covering maximum exposures to losses"
    ],
    complianceChecklist: [
      "Are assumptions on joint control or significant influence clearly laid out?",
      "Is summarized financial data presented for each material subsidiary with NCI?",
      "Are balance sheet and EBITDA summaries shown for major joint ventures?",
      "Are legal restrictions on funds moving within the corporate group disclosed?",
      "Are exposures in unconsolidated structured entities quantified?"
    ],
    sourceParagraphs: [
      {
        id: "ifrs12-p7",
        citation: "IFRS 12 Paragraph 7",
        title: "Significant Judgments in Consolidation",
        description: "An entity shall disclose information about significant judgements and assumptions it has made in determining: (a) that it has control of another entity; (b) that it has joint control... or (c) that it has significant influence over another entity."
      },
      {
        id: "ifrs12-p10",
        citation: "IFRS 12 Paragraph 10",
        title: "Group Composition Disclosures",
        description: "An entity shall disclose information that enables users of its consolidated financial statements: (a) to understand the composition of the group; and (b) the interest that non-controlling interests have in the group's activities and cash flows."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs12-1",
        title: "Corporate Subsidiary Financial Data Compilation",
        issue: "Are additional ledger entries created when disclosing parent investments under IFRS 12?",
        scenario: "Cargo Hub Ltd is a 35% owned joint venture. Auditors demand summarized balance sheets to support corporate figures.",
        analysis: "IFRS 12 requires extensive disclosures summarizing Cargo Hub's assets, debts, and profits. No double-entry modifications occur in the main ledger, but compliant disclosures must specify the data details within the annual report notes.",
        journalEntries: [
          {
            description: "No direct ledger changes are recorded under IFRS 12 disclosure rules:",
            debit: "Group Joint Venture Supplementary Disclosure Plates",
            credit: "Group Financial Reporting Note Appendix",
            amount: "$0"
          }
        ]
      }
    ]
  },
  {
    id: "IFRS-13",
    code: "IFRS 13",
    title: "Fair Value Measurement",
    effectiveDate: "1 January 2013",
    summary: "Unifies the definition of fair value as an orderly market exit price, framing a single measurement guide and establishing the three-level Fair Value Hierarchy.",
    keyConcepts: [
      "Fair Value is marked as an orderly transaction exit price",
      "Evaluating most active principal or most advantageous markets",
      "Highest and Best Use parameters for valued physical property",
      "The Three-Level Fair Value Input Hierarchy (Quoted, Observable, Unobservable)"
    ],
    complianceChecklist: [
      "Is fair value derived as the market exit price at the measurement date?",
      "Do the metrics rely on buyer/seller participants rather than company plans?",
      "Is the highest and best use of non-financial properties verified?",
      "Are measured assets split into Level 1, Level 2, and Level 3 hierarchies?",
      "Are Level 3 valuation equations, cash flows, and sensitivities disclosed?"
    ],
    sourceParagraphs: [
      {
        id: "ifrs13-p9",
        citation: "IFRS 13 Paragraph 9",
        title: "Defining Fair Value as Exit Price",
        description: "Fair value is the price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date."
      },
      {
        id: "ifrs13-p72",
        citation: "IFRS 13 Paragraph 72",
        title: "The Fair Value Input Hierarchy",
        description: "To increase consistency and comparability in fair value measurements and related disclosures, this IFRS establishes a fair value hierarchy that categorises into three levels the inputs to valuation techniques used to measure fair value."
      },
      {
        id: "ifrs13-p76",
        citation: "IFRS 13 Paragraph 76",
        title: "Level 1 Inputs (Quoted Prices)",
        description: "Level 1 inputs are quoted prices (unadjusted) in active markets for identical assets or liabilities that the entity can access at the measurement date."
      },
      {
        id: "ifrs13-p86",
        citation: "IFRS 13 Paragraph 86",
        title: "Level 3 Inputs (Unobservable Forecasts)",
        description: "Level 3 inputs are unobservable inputs for the asset or liability... used to measure fair value to the extent that relevant observable inputs are available, thereby allowing for situations in which there is little, if any, market activity."
      }
    ],
    caseStudies: [
      {
        id: "cs-ifrs13-1",
        title: "Classifying Level 3 Investment Land Projections",
        issue: "How is land valued and reported when active buyer prices are unavailable, requiring internal cash flows?",
        scenario: "Global Logistics holds vacant development land. With no regional sales records available, valuation teams construct a discounted leasing cash flow model.",
        analysis: "Under IFRS 13, because the valuation uses unobservable parameters (developer rents, regional discounts), the land falls under Level 3 of the Fair Value Hierarchy. It must be disclosed as Level 3, and sensitivity notes must detail the input parameters.",
        journalEntries: [
          {
            description: "To revalue land holdings upwards under fair value accounting:",
            debit: "Investment Properties (Fair Value Balance)",
            credit: "Fair Value Revaluation Gains (Non-operating Revenue P&L)",
            amount: "$50,000"
          }
        ]
      }
    ]
  }
];
