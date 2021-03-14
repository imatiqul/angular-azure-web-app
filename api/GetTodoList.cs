using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

namespace Atiq.Function
{
    public class Todo
    {
        public int Id { get; set; }
        public string Task { get; set; }
        public string Assignee { get; set; }
        public string Status { get; set; }

        public Todo(int id, string task, string assignee, string status)
        {
            Id = id;
            Task = task;
            Assignee = assignee;
            Status = status;
        }
    }

    public static class GetTodoList
    {
        [FunctionName("GetTodoList")]
        [OpenApiOperation(operationId: "Run", tags: new[] { "name" })]
        [OpenApiSecurity("function_key", SecuritySchemeType.ApiKey, Name = "code", In = OpenApiSecurityLocationType.Query)]
        [OpenApiParameter(name: "name", In = ParameterLocation.Query, Required = true, Type = typeof(string), Description = "The **Name** parameter")]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "text/plain", bodyType: typeof(string), Description = "The OK response")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            string responseMessage = string.IsNullOrEmpty(name)
                ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

            var todoList = new List<Todo>{
                new Todo(1, "task1",  "assignee1000", "completed"),
                new Todo(2, "task2",  "assignee1001", "pending"),
                new Todo(3, "task3",  "assignee1002", "completed"),
                new Todo(4, "task4",  "assignee1000", "completed"),
                new Todo(5, "task5",  "assignee1004", "completed"),
                };

            return new OkObjectResult(todoList);
        }
    }
}

