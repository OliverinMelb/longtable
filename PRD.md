Product Requirements Document (PRD)

Project Title: Reactive Data Table using Next.js, Supabase, and TailwindCSS

Objective

Develop a reactive data table application focusing solely on implementing the core functionalities of infinite scroll and bulk updates for handling large datasets. Use Next.js, Supabase, and TailwindCSS.

Features & Requirements

1. Infinite Scroll

Implement an infinite scroll mechanism to load data in chunks for better performance.

Support smooth scrolling and loading for large datasets, with efficient rendering for up to 50,000 rows.

2. Row Selection and Bulk Updates

Enable selection of arbitrary numbers of rows.

Implement a bulk update feature to modify a column's value across all selected rows, even if they are outside the current viewport.

3. Simplified Column Handling

Disregard support for adding/deleting columns.

Exclude custom column features.

Omit other_columns column support in the business_info_rows.csv dataset.