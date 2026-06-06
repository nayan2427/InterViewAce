/**
 * InterviewAce - MCQ Question Bank
 * 50 interview preparation questions across 6 categories
 */

const QUESTIONS = [
  // Java (9 questions)
  {
    id: 1,
    category: 'Java',
    question: 'Which keyword is used to inherit a class in Java?',
    options: ['implements', 'extends', 'inherits', 'super'],
    correct: 1
  },
  {
    id: 2,
    category: 'Java',
    question: 'What is the default value of a boolean variable in Java?',
    options: ['true', 'false', 'null', '0'],
    correct: 1
  },
  {
    id: 3,
    category: 'Java',
    question: 'Which method is the entry point of a Java program?',
    options: ['start()', 'run()', 'main()', 'init()'],
    correct: 2
  },
  {
    id: 4,
    category: 'Java',
    question: 'Which of the following is NOT a Java access modifier?',
    options: ['public', 'protected', 'private', 'internal'],
    correct: 3
  },
  {
    id: 5,
    category: 'Java',
    question: 'What does JVM stand for?',
    options: ['Java Variable Machine', 'Java Virtual Machine', 'Joint Virtual Memory', 'Java Verified Module'],
    correct: 1
  },
  {
    id: 6,
    category: 'Java',
    question: 'Which collection class allows duplicate elements?',
    options: ['HashSet', 'TreeSet', 'ArrayList', 'HashMap'],
    correct: 2
  },
  {
    id: 7,
    category: 'Java',
    question: 'Which interface must be implemented to use threads in Java?',
    options: ['Serializable', 'Runnable', 'Comparable', 'Cloneable'],
    correct: 1
  },
  {
    id: 8,
    category: 'Java',
    question: 'What is method overloading?',
    options: ['Same method name, different parameters', 'Redefining parent method', 'Hiding static methods', 'Creating abstract methods'],
    correct: 0
  },
  {
    id: 9,
    category: 'Java',
    question: 'Which keyword prevents method overriding?',
    options: ['static', 'final', 'abstract', 'volatile'],
    correct: 1
  },

  // DBMS (8 questions)
  {
    id: 10,
    category: 'DBMS',
    question: 'What does ACID stand for in database transactions?',
    options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integrity, Data', 'Automatic, Consistent, Indexed, Distributed', 'Analysis, Consistency, Integration, Design'],
    correct: 0
  },
  {
    id: 11,
    category: 'DBMS',
    question: 'Which normal form eliminates partial dependency?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correct: 1
  },
  {
    id: 12,
    category: 'DBMS',
    question: 'What is a primary key?',
    options: ['A foreign reference', 'A unique identifier for a record', 'An indexed column only', 'A backup key'],
    correct: 1
  },
  {
    id: 13,
    category: 'DBMS',
    question: 'Which operation is NOT part of relational algebra?',
    options: ['Select', 'Project', 'Compile', 'Join'],
    correct: 2
  },
  {
    id: 14,
    category: 'DBMS',
    question: 'What is a deadlock in DBMS?',
    options: ['Database crash', 'Circular wait for resources', 'Data corruption', 'Index failure'],
    correct: 1
  },
  {
    id: 15,
    category: 'DBMS',
    question: 'Which key can have NULL values?',
    options: ['Primary Key', 'Foreign Key', 'Super Key', 'Candidate Key'],
    correct: 1
  },
  {
    id: 16,
    category: 'DBMS',
    question: 'What does ER diagram represent?',
    options: ['Entity-Relationship model', 'Error-Recovery model', 'Encrypted-Record model', 'Event-Response model'],
    correct: 0
  },
  {
    id: 17,
    category: 'DBMS',
    question: 'Which indexing structure is commonly used in databases?',
    options: ['Stack', 'B-Tree', 'Queue', 'Linked List'],
    correct: 1
  },

  // SQL (8 questions)
  {
    id: 18,
    category: 'SQL',
    question: 'Which SQL clause is used to filter rows?',
    options: ['GROUP BY', 'WHERE', 'HAVING', 'ORDER BY'],
    correct: 1
  },
  {
    id: 19,
    category: 'SQL',
    question: 'Which command is used to remove all records from a table without logging individual row deletions?',
    options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'],
    correct: 2
  },
  {
    id: 20,
    category: 'SQL',
    question: 'Which join returns only matching rows from both tables?',
    options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'CROSS JOIN'],
    correct: 2
  },
  {
    id: 21,
    category: 'SQL',
    question: 'Which aggregate function counts non-null values?',
    options: ['SUM()', 'COUNT()', 'AVG()', 'MAX()'],
    correct: 1
  },
  {
    id: 22,
    category: 'SQL',
    question: 'Which keyword is used to sort result sets?',
    options: ['SORT BY', 'ORDER BY', 'GROUP BY', 'ARRANGE BY'],
    correct: 1
  },
  {
    id: 23,
    category: 'SQL',
    question: 'What does DDL stand for?',
    options: ['Data Definition Language', 'Data Deletion Language', 'Dynamic Data Language', 'Database Design Language'],
    correct: 0
  },
  {
    id: 24,
    category: 'SQL',
    question: 'Which constraint ensures uniqueness of values in a column?',
    options: ['CHECK', 'UNIQUE', 'DEFAULT', 'FOREIGN KEY'],
    correct: 1
  },
  {
    id: 25,
    category: 'SQL',
    question: 'Which clause filters groups after aggregation?',
    options: ['WHERE', 'HAVING', 'FILTER', 'GROUP WHERE'],
    correct: 1
  },

  // Operating System (8 questions)
  {
    id: 26,
    category: 'Operating System',
    question: 'Which scheduling algorithm can cause starvation?',
    options: ['FCFS', 'Round Robin', 'Priority Scheduling', 'SJF (non-preemptive)'],
    correct: 2
  },
  {
    id: 27,
    category: 'Operating System',
    question: 'What is a page fault?',
    options: ['Disk failure', 'Requested page not in memory', 'CPU overload', 'Process termination'],
    correct: 1
  },
  {
    id: 28,
    category: 'Operating System',
    question: 'Which memory management technique uses fixed-size blocks?',
    options: ['Segmentation', 'Paging', 'Swapping', 'Compaction'],
    correct: 1
  },
  {
    id: 29,
    category: 'Operating System',
    question: 'What is a semaphore used for?',
    options: ['File encryption', 'Process synchronization', 'Memory allocation', 'Disk scheduling'],
    correct: 1
  },
  {
    id: 30,
    category: 'Operating System',
    question: 'Which state indicates a process is ready to execute?',
    options: ['Blocked', 'Running', 'Ready', 'Terminated'],
    correct: 2
  },
  {
    id: 31,
    category: 'Operating System',
    question: 'What is thrashing in OS?',
    options: ['High page fault rate due to insufficient memory', 'CPU overheating', 'Disk fragmentation', 'Thread deadlock'],
    correct: 0
  },
  {
    id: 32,
    category: 'Operating System',
    question: 'Which file allocation method uses a linked list of disk blocks?',
    options: ['Contiguous', 'Indexed', 'Linked', 'Sequential only'],
    correct: 2
  },
  {
    id: 33,
    category: 'Operating System',
    question: 'What is the kernel?',
    options: ['User interface', 'Core of the operating system', 'Device driver only', 'File system manager'],
    correct: 1
  },

  // Computer Networks (8 questions)
  {
    id: 34,
    category: 'Computer Networks',
    question: 'Which layer of OSI model handles routing?',
    options: ['Data Link', 'Network', 'Transport', 'Session'],
    correct: 1
  },
  {
    id: 35,
    category: 'Computer Networks',
    question: 'What does TCP stand for?',
    options: ['Transfer Control Protocol', 'Transmission Control Protocol', 'Transport Communication Protocol', 'Total Connection Protocol'],
    correct: 1
  },
  {
    id: 36,
    category: 'Computer Networks',
    question: 'Which protocol is connectionless?',
    options: ['TCP', 'HTTP', 'UDP', 'FTP'],
    correct: 2
  },
  {
    id: 37,
    category: 'Computer Networks',
    question: 'What is the default port for HTTP?',
    options: ['21', '25', '80', '443'],
    correct: 2
  },
  {
    id: 38,
    category: 'Computer Networks',
    question: 'Which device operates at the Data Link layer?',
    options: ['Router', 'Switch', 'Hub', 'Repeater'],
    correct: 1
  },
  {
    id: 39,
    category: 'Computer Networks',
    question: 'What is DNS used for?',
    options: ['Email transfer', 'Domain name to IP resolution', 'File transfer', 'Packet encryption'],
    correct: 1
  },
  {
    id: 40,
    category: 'Computer Networks',
    question: 'Which topology has a single point of failure at the center?',
    options: ['Bus', 'Ring', 'Star', 'Mesh'],
    correct: 2
  },
  {
    id: 41,
    category: 'Computer Networks',
    question: 'What does IP address 127.0.0.1 represent?',
    options: ['Broadcast address', 'Loopback address', 'Default gateway', 'Multicast address'],
    correct: 1
  },

  // Aptitude (9 questions)
  {
    id: 42,
    category: 'Aptitude',
    question: 'If 20% of a number is 50, what is the number?',
    options: ['200', '250', '300', '350'],
    correct: 1
  },
  {
    id: 43,
    category: 'Aptitude',
    question: 'Find the next number in the series: 2, 6, 12, 20, ?',
    options: ['28', '30', '32', '36'],
    correct: 1
  },
  {
    id: 44,
    category: 'Aptitude',
    question: 'A train travels 120 km in 2 hours. What is its speed?',
    options: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'],
    correct: 2
  },
  {
    id: 45,
    category: 'Aptitude',
    question: 'What is the average of 10, 20, and 30?',
    options: ['15', '20', '25', '30'],
    correct: 1
  },
  {
    id: 46,
    category: 'Aptitude',
    question: 'If A completes work in 10 days and B in 15 days, together they finish in?',
    options: ['5 days', '6 days', '7 days', '8 days'],
    correct: 1
  },
  {
    id: 47,
    category: 'Aptitude',
    question: 'What is 15% of 200?',
    options: ['20', '25', '30', '35'],
    correct: 2
  },
  {
    id: 48,
    category: 'Aptitude',
    question: 'Find odd one out: Apple, Mango, Potato, Banana',
    options: ['Apple', 'Mango', 'Potato', 'Banana'],
    correct: 2
  },
  {
    id: 49,
    category: 'Aptitude',
    question: 'A shopkeeper sells an item at 10% profit. Cost price is ₹500. Selling price is?',
    options: ['₹525', '₹550', '₹575', '₹600'],
    correct: 1
  },
  {
    id: 50,
    category: 'Aptitude',
    question: 'How many squares are on a standard chessboard?',
    options: ['64', '204', '128', '256'],
    correct: 1
  }
];

const CATEGORIES = ['Java', 'DBMS', 'SQL', 'Operating System', 'Computer Networks', 'Aptitude'];
