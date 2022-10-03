using CustomerApp.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [EnableCors("OpenCORSPolicy")]
    public class CustomersController : ControllerBase
    {
        private readonly CustomersContext _customersContext;

        public CustomersController(CustomersContext customersContext) => _customersContext = customersContext;

        [HttpGet]
        public async Task<ActionResult> GetCustomers()
        {
            try
            {
                return _customersContext.Customers != null && _customersContext.Customers.Any() ? Ok(await _customersContext.Customers.OrderBy(x => x.Id).ToListAsync())
              : NoContent();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            try
            {
                var result = await _customersContext.Customers.SingleOrDefaultAsync(x => x.Id == id);

                if (result == null)
                    return NotFound();

                return Ok(result);
            }

            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                 "Error retrieving data from the database");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> CreateCustomer([FromBody] Customer customer)
        {

            int customerId = 0;
            try
            {
                if (customer == null)
                    return BadRequest();

                customer.Updated = DateTime.UtcNow;
                customer.Created = DateTime.UtcNow;

                await _customersContext.Customers.AddAsync(customer);
                customerId = await _customersContext.SaveChangesAsync();

                var newCustomer = await _customersContext.Customers.SingleOrDefaultAsync(x => x.Id == customerId);

                return CreatedAtAction(nameof(GetCustomer), new { id = customerId }, newCustomer);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating customer.");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Customer>> UpdateCustomer(int id, Customer customer)
        {
            try
            {
                if (id != customer.Id)
                    return BadRequest("Customer ID mismatch");

                var customerToUpdate = await _customersContext.Customers.SingleOrDefaultAsync(c => c.Id == id);

                if (customerToUpdate == null)
                    return NotFound($"Customer with Id = {id} not found");

                // normally I'd use automapper here 
                customerToUpdate.Updated = DateTime.UtcNow;
                if (customer?.FirstName != null)
                customerToUpdate.FirstName = customer.FirstName;

                if (customer?.LastName != null)
                    customerToUpdate.LastName = customer.LastName;

                if (customer?.Email != null)
                    customerToUpdate.Email = customer.Email;
                

                _customersContext.Customers.Update(customerToUpdate);
                await _customersContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error updating customer");
            }
        }
    }
}
