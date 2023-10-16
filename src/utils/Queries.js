export default {
    queries: [
        {QueryType: 'General', QueryName: "Last 100 Findings", QueryText: "Select timestamp, account_id, account_name, finding, resource from findings where product = 'Steampipe' limit 100';"},
        {QueryType: 'IAM', QueryName: "All Admin Users", QueryText: "Select account_id, account_name, resource from findings where finding like '%User Admin%';"},
        {QueryType: 'IAM', QueryName: "IAM Outdated Access Keys", QueryText: "Select * from findings where finding = 'IAM User Access Keys Outdated';"},
        {QueryType: 'EC2', QueryName: "All EC2 Findings", QueryText: "select * from findings where resource_type = 'EC2'"},
        {QueryType: 'EC2', QueryName: "EC2 Public IPs", QueryText: "select * from findings where finding = 'EC2 Public IP';"},
        {QueryType: 'EC2', QueryName: "EC2 Long Running", QueryText: "select timestamp, account_id, account_name, finding, resource, days_running from findings where finding = 'EC2 Long Running Instance';"},
        {QueryType: 'EC2', QueryName: "All EC2 Subnets", QueryText: "select timestamp, account_id, account_name, finding, resource, cidr_block from findings where finding = 'EC2 Subnets';"},
        {QueryType: 'WAF', QueryName: "WAF WebACLs Without Standard Ruleset", QueryText: "select * from findings where finding = 'WAF WebACL Without AWS Managed RuleSet';"},
        {QueryType: 'WAF', QueryName: "WAF WebACLs With No Rules", QueryText: "select * from findings where finding = 'WFA WebACL No Attached rules';"},
        {QueryType: 'API', QueryName: "Public APIs Without WAF", QueryText: "select * from findings where finding = 'Public API Gateway Without WAF';"},
        {QueryType: 'API', QueryName: "All Public APIs", QueryText: "select * from findings where finding = 'API Gateway Public';"},
        {QueryType: 'Cloudfront', QueryName: "Cloudfront Without WAF", QueryText: "select * from findings where finding = 'Cloufront Without WAF';"},
        {QueryType: 'Lambda', QueryName: "Lambda Public Access", QueryText: "select * from findings where finding = 'Lambda Public Access';"},
        {QueryType: 'EKS', QueryName: "All EKS Clusters", QueryText: "select * from findings where finding = 'EKS Cluster';"},
        {QueryType: 'SecurityHub', QueryName: "SecurityHub Criticals & Highs", QueryText: "select account_name, finding, resource, severity from findings where product = 'SecurityHub' and severity = 'CRITICAL' or severity = 'HIGH';"},
        {QueryType: 'Qualys', QueryName: "Qualys Findings sorted by Critical", QueryText: "select timestamp, finding, ip, dns, criticals, highs, mediums from findings where product = 'Qualys' order by criticals::INTEGER desc;"},
    ]
}